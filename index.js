const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const {
  EmbedBuilder,
  Client,
  GatewayIntentBits,
  Collection,
  ChannelType,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  ContainerBuilder,
  MessageFlags,
  AttachmentBuilder,
  ActionRowBuilder,
} = require("discord.js");
const express = require("express");
const multer = require("multer");
const app = express();

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Configuração de variáveis de ambiente
dotenv.config();

const thumbnail = path.join(__dirname, "commands", "assets", "omega.png");
const PORT = Number(process.env.PORT || 10000);
const HOST = process.env.HOST || "0.0.0.0";

function requireCoreApiKey(req, res, next) {
  const expectedKey = process.env.OMEGA_CORE_API_KEY?.trim();
  const receivedKey = req.get("x-api-key") || req.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!expectedKey || receivedKey !== expectedKey) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  return next();
}

if (!PORT || Number.isNaN(PORT)) {
  console.error(`❌ Porta inválida detectada: ${process.env.PORT}`);
  process.exit(1);
}

console.log(`🔌 Iniciando servidor HTTP em ${HOST}:${PORT}`);

// Importar Firebase (inicializar automaticamente)
const { db } = require("./src/config/firebase.js");

// Importar loaders
const { loadCommands, loadEvents } = require("./src/utils/loaders.js");

// Criar cliente Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("debug", (message) => console.log(`[Discord] ${message}`));
client.on("warn", (message) => console.warn(`[Discord] ${message}`));
client.on("error", (error) => console.error("❌ Erro no cliente Discord:", error));
client.on("shardError", (error) => console.error("❌ Erro no Gateway Discord:", error));
client.on("shardConnecting", (id) => console.log(`🔌 Conectando ao shard ${id}...`));
client.on("shardReady", (id) => console.log(`✅ Shard ${id} conectado.`));
client.on("shardReconnecting", (id) => console.warn(`🔄 Reconectando o shard ${id}...`));
client.on("shardDisconnect", (event, id) => {
  console.error(`❌ Shard ${id} desconectado: código ${event.code} (${event.reason || "sem motivo"})`);
});
client.on("invalidated", () => console.error("❌ A sessão do bot foi invalidada pelo Discord."));

// Collection para armazenar comandos
client.commands = new Collection();

app.get("/", (req, res) => {
  res.json({ service: "omega-quantum-bot", status: "online" });
});

app.get("/api/health", (req, res) => {
  res.json({
    service: "omega-quantum-bot",
    status: client.isReady() ? "ready" : "starting",
    uptime: Math.floor(process.uptime()),
  });
});

app.get("/api/status", requireCoreApiKey, async (req, res) => {
  try {
    const snapshot = await db.collection("service").doc("status").get();

    return res.json({
      exists: snapshot.exists,
      data: snapshot.exists ? snapshot.data() : null,
    });
  } catch (error) {
    console.error("❌ Erro na API ao consultar status:", error.message);
    return res.status(503).json({ error: "Omega Core Cloud indisponível" });
  }
});

app.post("/api/status", requireCoreApiKey, async (req, res) => {
  const allowedStatuses = new Set(["online", "offline", "maintenance"]);
  const serviceNames = ["tarefasp", "expansao", "leitura", "speak", "redacao"];
  const invalidService = serviceNames.find(
    (serviceName) => req.body[serviceName] !== undefined && !allowedStatuses.has(req.body[serviceName])
  );

  if (invalidService) {
    return res.status(400).json({
      error: `${invalidService} deve ser online, offline ou maintenance`,
    });
  }

  const statusData = Object.fromEntries(
    serviceNames
      .filter((serviceName) => req.body[serviceName] !== undefined)
      .map((serviceName) => [serviceName, req.body[serviceName]])
  );

  if (!Object.keys(statusData).length) {
    return res.status(400).json({ error: "Envie pelo menos um serviço para atualizar" });
  }

  try {
    await db.collection("service").doc("status").set(statusData, { merge: true });
    return res.status(202).json({ updated: true, data: statusData });
  } catch (error) {
    console.error("❌ Erro na API ao atualizar status:", error.message);
    return res.status(503).json({ error: "Não foi possível atualizar o Omega Core Cloud" });
  }
});

app.post("/api/support/create-ticket", requireCoreApiKey, upload.single("anexos"), async (req, res) => {
  const { email, nome, plano, discordID, ticketId, categoria, mensagem } = req.body;
  const guildId = process.env.SUPPORT_GUILD_ID || process.env.GUILD_ID;
  const supportRoleId = process.env.SUPPORT_ROLE_ID;
  const supportCategoryId = process.env.SUPPORT_CATEGORY_ID;
  const normalizedPlan = String(plano || "").toLowerCase().trim();

  const priorities = {
    semanal: { label: "Normal", emoji: "🔵" },
    mensal: { label: "Normal", emoji: "🔵" },
    trimestral: { label: "Alta", emoji: "🟠" },
    anual: { label: "Máxima", emoji: "🔴" },
  };
  const priority = priorities[normalizedPlan];

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "email válido é obrigatório" });
  }

  if (!nome || typeof nome !== "string" || nome.trim().length > 100) {
    return res.status(400).json({ error: "nome é obrigatório e deve ter até 100 caracteres" });
  }

  if (!priority) {
    return res.status(400).json({
      error: "plano deve ser semanal, mensal, trimestral ou anual",
    });
  }
  if (!/^\d{17,20}$/.test(String(discordID || ""))) {
    return res.status(400).json({ error: "discordID inválido" });
  }
  if (!guildId || !supportRoleId) {
    return res.status(500).json({ error: "Suporte Discord não está configurado no bot" });
  }
  if (!client.isReady()) {
    return res.status(503).json({ error: "Bot Discord ainda está conectando" });
  }

  try {
    const guild = await client.guilds.fetch(guildId);
    const member = await guild.members.fetch(discordID);
    const supportRole = await guild.roles.fetch(supportRoleId);

    if (!supportRole) {
      return res.status(500).json({ error: "Cargo de suporte não encontrado" });
    }


    const safeUsername = member.user.username
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 100);
    const channelName = `[${priority.emoji}]-suporte-${safeUsername}`.slice(0, 100);
as
    const permissionOverwrites = [
      {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: supportRole.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: member.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
      {
        id: client.user.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory,
          PermissionFlagsBits.ManageChannels,
        ],
      },
    ];

    const channel = await guild.channels.create({
      name: channelName || `suporte-${member.id}`,
      type: ChannelType.GuildText,
      parent: supportCategoryId || undefined,
      permissionOverwrites,
    });

    if (req.file) {
      const anexoPrint = new AttachmentBuilder(req.file.buffer, { name: req.file.originalname });
      await channel.send({
        content: `📸 Captura de Tela enviada pelo cliente`,
        files: [anexoPrint]
      })
    }

    const priorityColor = priority.label === "Máxima" ? 0xf04747 : priority.label === "Alta" ? 0xfaa61a : 0x3498db;

    const container = new ContainerBuilder()
      .setAccentColor(priorityColor);
    container.addTextDisplayComponents((text) =>
      text.setContent(
        `Olá, <@${member.id}>! A equipe de suporte está aqui para ajudar.\n` +
        `Um atendente com o cargo <@&${supportRole.id}> responderá em breve.`
      )
    );
    container.addTextDisplayComponents((text) =>
      text.setContent(`# **Ticket ${ticketId}**`));
    container.addSeparatorComponents((separator) => separator)
    container.addTextDisplayComponents((text) =>
      text.setContent(
        `• **Cliente:** ${nome.trim()}\n` +
        `• **Plano:** \`${plano}\`\n` +
        `• **Prioridade:** ${priority.emoji} ${priority.label}\n` +
        `• **E-mail:** \`${email.trim()}\``
      ))
    container.addSeparatorComponents((separator) => separator)
    container.addTextDisplayComponents((text) =>
      text.setContent(`## Categoria: ${categoria}\nMensagem do cliente:\n>>> ${mensagem}`))
    container.addSeparatorComponents((separator) => separator)
    container.addTextDisplayComponents((text) =>
          text.setContent(`**<:staff:1021090313076482088> [Painel Staff]** Escolha uma ação para este ticket:`))
    const buttonRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`fechar_ticket_${ticketId}`)
        .setLabel("Fechar Ticket")
        .setEmoji(`<a:Warn_9:1019200893209563136>`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`punir_${ticketId}_${discordID}`)
        .setLabel(`Punir Cliente & Fechar Ticket`)
        .setEmoji(`<:ban_icon:1021364346774888569>`)
        .setStyle(ButtonStyle.Danger)
    );
    container.addActionRowComponents(buttonRow);
    container.addTextDisplayComponents((text) =>
      text.setContent(
        `-# **Omega Quantum Support** - ${new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })} -`
      ));

    await channel.send({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });

    console.log(`🎫 Ticket criado: ${channel.id} para ${member.user.tag} (${priority.label})`);
    return res.status(201).json({
      created: true,
      ticketId: channel.id,
      channelName: channel.name,
      priority: priority.label,
      priorityEmoji: priority.emoji,
    });
  } catch (error) {
    console.error("❌ Erro ao criar ticket de suporte:", error.message);
    return res.status(500).json({ error: "Não foi possível criar o ticket de suporte" });
  }
});

const healthServer = http.createServer(app);

healthServer.on("error", (error) => {
  console.error(`❌ Erro no servidor HTTP: ${error.message}`);
  process.exit(1);
});

healthServer.listen({ port: PORT, host: HOST }, () => {
  const addr = healthServer.address();
  console.log(`🌐 Servidor de saúde ouvindo em ${addr.address}:${addr.port}`);
});

// ========================================
// INICIALIZAR BOT
// ========================================

async function initialize() {
  console.log("\n📱 Omega Quantum Bot - v14\n");

  // Carregar eventos
  console.log("📂 Carregando eventos...");
  const eventsStats = await loadEvents(client);
  console.log(`   Total: ${eventsStats.total} | Carregados: ${eventsStats.loaded} | Erros: ${eventsStats.failed}`);
  eventsStats.details.forEach((detail) => console.log(`   ${detail}`));

  // Carregar comandos
  console.log("\n📂 Carregando comandos...");
  const commandsStats = await loadCommands(client);
  console.log(`   Total: ${commandsStats.total} | Carregados: ${commandsStats.loaded} | Erros: ${commandsStats.failed}`);
  commandsStats.details.forEach((detail) => console.log(`   ${detail}`));

  // Login
  console.log("\n🔐 Autenticando no Discord...");
  const discordToken = process.env.DISCORD_TOKEN?.trim();

  if (!discordToken) {
    console.error("❌ Erro: DISCORD_TOKEN não configurado no .env");
    process.exit(1);
  }

  client.once("ready", async () => {
    console.log("📡 Bot pronto. Registrando comandos slash...");
    await registerSlashCommands();
    console.log("📡 Iniciando monitoramento de status...");
    iniciarMonitoramentoStatus();
  });

  let loginTimeout;

  try {
    const loginPromise = client.login(discordToken);

    await Promise.race([
      loginPromise,
      new Promise((_, reject) => {
        loginTimeout = setTimeout(
          () => reject(new Error("timeout aguardando conexão com o Gateway do Discord (45s)")),
          45000
        );
      }),
    ]);
  } catch (error) {
    console.error("❌ Erro ao fazer login no Discord:", error.message);
    console.error("Verifique se o token está válido e se o bot está habilitado no Developer Portal.");
    process.exit(1);
  } finally {
    clearTimeout(loginTimeout);
  }
}

async function registerSlashCommands() {
  const GUILD_ID = process.env.GUILD_ID;
  const commands = client.commands.map((command) => command.data.toJSON());

  if (!commands.length) {
    console.log("⚠️ Nenhum comando encontrado para registrar.");
    return;
  }

  try {
    if (GUILD_ID) {
      await client.application.commands.set(commands, GUILD_ID);
      console.log(`✅ ${commands.length} comandos registrados para o servidor ${GUILD_ID}.`);
    } else {
      await client.application.commands.set(commands);
      console.log(`✅ ${commands.length} comandos registrados globalmente.`);
    }
  } catch (error) {
    console.error("❌ Falha ao registrar comandos slash:", error);
  }
}

let ultimaMensagem = null;
let atualizandoStatus = false;
let ultimoSignature = null;
const CANAL_ALERTAS_ID = "1510023475258200084";

async function publicarStatusNoCanal(docData) {
  const signature = JSON.stringify(docData);
  if (signature === ultimoSignature) return;
  ultimoSignature = signature;

  const canal = await client.channels.fetch(CANAL_ALERTAS_ID).catch(() => null);
  if (!canal || !canal.isTextBased?.()) {
    console.log("Não encontrei o canal ou ele não é um canal de texto.");
    return;
  }

  if (ultimaMensagem) {
    try {
      const mensagemAtual = await canal.messages.fetch(ultimaMensagem.id).catch(() => null);
      if (mensagemAtual) {
        await mensagemAtual.delete();
      }
    } catch (error) {
      console.log("Não consegui deletar a mensagem anterior.");
    }
  }

  const statusVisual = {
    online: "<:online:1011055332753158215> **Online**",
    offline: "<:offline:1011055462747213844> **Offline**",
    maintenance: "<a:Warn_9:1019200893209563136> **Manutenção**",
  };

  const omegaEmoji = "<:omega:1526684173908316362>";
  const nomesFormatados = {
    tarefasp: `${omegaEmoji} Tarefas SP`,
    expansao: `${omegaEmoji} Expansão Noturno`,
    leitura: `${omegaEmoji} Leitura`,
    speak: `${omegaEmoji} Speak`,
    redacao: `${omegaEmoji} Redação`,
  };

  const { tarefasp, expansao, leitura, speak, redacao } = docData;
  const tituloFixo = "<:warn_5:1019045917518737438> Status do Sistema";

  let corEmbed = "#43B581";
  let avisoDestaque =
    "> ✨ **Sistemas totalmente operacionais.**\n> Todos os módulos estão respondendo dentro dos parâmetros ideais.";

  if (
    tarefasp === "offline" ||
    expansao === "offline" ||
    leitura === "offline" ||
    speak === "offline" ||
    redacao === "offline"
  ) {
    corEmbed = "#F04747";
    avisoDestaque =
      "> 🔴 **Instabilidade detectada.**\n> Nossa equipe foi alertada e está trabalhando para resolver.";
  } else if (
    tarefasp === "maintenance" ||
    expansao === "maintenance" ||
    leitura === "maintenance" ||
    speak === "maintenance" ||
    redacao === "maintenance"
  ) {
    corEmbed = "#FAA61A";
    avisoDestaque =
      "> <a:Warn_9:1019200893209563136> **Manutenção ativa.**\n> Otimizações em andamento para aprimorar a estabilidade da plataforma.";
  }

  const textoDescricao = [
    "Painel de monitoramento em tempo real de todos os módulos operacionais integrados à plataforma **Omega Quantum**.",
    "",
    avisoDestaque,
    "",
    "📊 **Módulos Disponíveis:**",
  ].join("\n");

  const guild = canal.guild;
  const serverIcon = guild?.iconURL({ extension: "png", dynamic: true, size: 1024 });

  const embed = new EmbedBuilder()
    .setTitle(tituloFixo)
    .setColor(corEmbed)
    .setDescription(textoDescricao)
    .setThumbnail(serverIcon || null)
    .setImage(`attachment://${path.basename(thumbnail)}`)
    .setAuthor({ name: guild?.name || "Omega Quantum", iconURL: serverIcon || undefined })
    .addFields(
      { name: nomesFormatados.tarefasp, value: statusVisual[tarefasp] || "⚪ Carregando...", inline: true },
      { name: nomesFormatados.expansao, value: statusVisual[expansao] || "⚪ Carregando...", inline: true },
      { name: nomesFormatados.leitura, value: statusVisual[leitura] || "⚪ Carregando...", inline: true },
      { name: nomesFormatados.speak, value: statusVisual[speak] || "⚪ Carregando...", inline: true },
      { name: nomesFormatados.redacao, value: statusVisual[redacao] || "⚪ Carregando...", inline: true }
    )
    .setFooter({ text: "Sincronizado via Omega Core Cloud" })
    .setTimestamp();

  const mensagemNova = await canal.send({ embeds: [embed], files: [thumbnail] });
  ultimaMensagem = mensagemNova;
}

async function iniciarMonitoramentoStatus() {
  const docRef = db.collection("service").doc("status");
  docRef.onSnapshot(async (doc) => {
    if (!doc.exists) return;
    if (atualizandoStatus) return;

    atualizandoStatus = true;
    try {
      await publicarStatusNoCanal(doc.data());
    } finally {
      atualizandoStatus = false;
    }
  });
}



initialize();

// Tratamento de erros não capturados
process.on("unhandledRejection", (error) => {
  console.error("❌ Promise rejeitada não tratada:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Exceção não capturada:", error);
});