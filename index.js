const dotenv = require("dotenv");
const { EmbedBuilder, Client, GatewayIntentBits, Collection } = require("discord.js");

// Configuração de variáveis de ambiente
dotenv.config();

// Importar Firebase (inicializar automaticamente)
const { db } = require("./src/config/firebase.js");

// Importar loaders
const { loadCommands, loadEvents } = require("./src/utils/loaders.js");

// Criar cliente Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Collection para armazenar comandos
client.commands = new Collection();

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
  if (!process.env.DISCORD_TOKEN) {
    console.error("❌ Erro: DISCORD_TOKEN não configurado no .env");
    process.exit(1);
  }

  try {
    await client.login(process.env.DISCORD_TOKEN);
    client.once("ready", () => {
      console.log("📡 Bot pronto. Iniciando monitoramento de status...");
      iniciarMonitoramentoStatus();
    });
  } catch (error) {
    console.error("❌ Erro ao fazer login:", error.message);
    process.exit(1);
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
    .setImage(serverIcon || null)
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

  const mensagemNova = await canal.send({ embeds: [embed] });
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
