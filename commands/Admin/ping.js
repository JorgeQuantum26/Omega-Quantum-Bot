const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const { db } = require("../../src/config/firebase.js");

function formatLatency(value) {
  if (!Number.isFinite(value)) return "Indisponível";
  return `${Math.max(0, Math.round(value))}ms`;
}

function getLatencyStatus(value) {
  if (!Number.isFinite(value)) return "🔴 Indisponível";
  if (value <= 150) return "🟢 Excelente";
  if (value <= 300) return "🟡 Estável";
  return "🔴 Elevada";
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}min`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Verifica a saúde da conexão do Omega Quantum."),

  async execute(interaction) {
    const startedAt = Date.now();
    await interaction.deferReply();

    const discordApiLatency = Date.now() - startedAt;
    const websocketLatency = interaction.client.ws.ping;
    const coreStartedAt = Date.now();
    let coreLatency = null;
    let coreStatus = "🔴 Indisponível";

    try {
      const statusSnapshot = await db.collection("service").doc("status").get();
      coreLatency = Date.now() - coreStartedAt;
      coreStatus = statusSnapshot.exists ? "🟢 Operacional" : "🟡 Sem status";
    } catch (error) {
      console.error("❌ Falha ao consultar o Omega Core Cloud:", error.message);
    }

    const worstLatency = [discordApiLatency, websocketLatency, coreLatency]
      .filter(Number.isFinite)
      .reduce((highest, value) => Math.max(highest, value), 0);

    const embed = new EmbedBuilder()
      .setColor(worstLatency <= 300 && coreLatency !== null ? 0x43b581 : 0xfaa61a)
      .setTitle("🏓 Omega Quantum • Diagnóstico de Conexão")
      .setDescription("Relatório em tempo real dos serviços principais da plataforma.")
      .addFields(
        {
          name: "🌐 API do Discord",
          value: `${formatLatency(discordApiLatency)} • ${getLatencyStatus(discordApiLatency)}`,
          inline: true,
        },
        {
          name: "🔌 WebSocket",
          value: `${formatLatency(websocketLatency)} • ${getLatencyStatus(websocketLatency)}`,
          inline: true,
        },
        {
          name: "☁️ Omega Core Cloud",
          value:
            `${formatLatency(coreLatency)} • ${coreStatus}`,
          inline: true,
        },
        {
          name: "⏱️ Uptime",
          value: formatUptime(process.uptime()),
          inline: true,
        },
        {
          name: "📡 Status do Gateway",
          value: interaction.client.ws.status === 0 ? "🟢 Conectado" : "🟡 Reconectando",
          inline: true,
        },
        {
          name: "🧩 Ambiente",
          value: process.env.NODE_ENV || "production",
          inline: true,
        }
      )
      .setFooter({ text: "Omega Core Monitor • Diagnóstico seguro" })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  },
};
