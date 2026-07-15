const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const db = require("../../../src/config/firebase.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Mostra informações de uma conta do Omega Quantum.")
        .addStringOption(option =>
            option
                .setName("deviceid")
                .setDescription("ID do dispositivo (Página Conta do Omega)")
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        try {

            const deviceId = interaction.options.getString("deviceid");

            const doc = await db.collection("users").doc(deviceId).get();

            if (!doc.exists) {
                return interaction.editReply({
                    content:
                        "<:recusado:1031262539272687777> **Dispositivo não encontrado.**\n> Verifique se o Device ID informado está correto."
                });
            }

            const userData = doc.data();

            const stats = userData.stats || {};
            const limits = userData.limits || {};

            // ===============================
            // Helpers
            // ===============================

            const planos = {
                semanal: "🥉 Semanal Premium • R$ 9,99",
                mensal: "🥈 Mensal Premium • R$ 29,99",
                trimestral: "🥇 Trimestral Premium • R$ 79,99",
                anual: "💎 Anual Premium • R$ 199,99"
            };

            const plano =
                planos[(userData.plan || "").toLowerCase()] ||
                userData.plan ||
                "Desconhecido";

            let statusEmoji = "⚪";
            let statusTexto = "Sem plano";

            const status = String(userData.status || "").toLowerCase().trim();

            if (status === "active" || status === "ativo") {
                statusEmoji = "🟢";
                statusTexto = "Ativo";
            } else if (status === "expired" || status === "expirado") {
                statusEmoji = "🔴";
                statusTexto = "Expirado";
            } else if (status === "blocked" || status === "bloqueado") {
                statusEmoji = "⛔";
                statusTexto = "Bloqueado";
            }

            function formatDate(date) {

                if (!date) return "Não informado";

                const d = new Date(date);

                if (isNaN(d.getTime()))
                    return "Não informado";

                return d.toLocaleDateString("pt-BR");

            }

            function formatDateTime(date) {

                if (!date) return "Nenhuma";

                const d = new Date(date);

                if (isNaN(d.getTime()))
                    return date;

                return d.toLocaleString("pt-BR");

            }

            function calcularTempoEconomizado(questoes) {

                // Aproximadamente 7 minutos economizados por questão.

                const minutos = questoes * 7;

                const horas = Math.floor(minutos / 60);
                const mins = minutos % 60;

                return `${horas}h ${mins}min`;

            }

            const questionsSolved = stats.questionsSolved || 0;
            const questionsToday = limits.questionsToday || 0;
            const essaysGenerated = stats.essaysGenerated || 0;
            const readingHours = stats.readingHours || 0;
            const precision = stats.precision || 0;

            const embed = new EmbedBuilder()
                .setColor(0x18D7B6)
                .setTitle("<:user:1019271077890887781> Informações do Usuário")
                .setDescription(`Informações associadas ao dispositivo **${deviceId}**.`)
                .addFields(
                    {
                        name: "👤 Usuário",
                        value: `**Dispositivo:** \`${deviceId}\`\n**Nome:** ${userData.name || "Não informado"}\n**Status:** ${statusTexto}\n**Plano:** ${plano}\n**Expira em:** ${formatDate(userData.expirationDate)}`,
                        inline: false
                    },
                    {
                        name: "📊 Estatísticas",
                        value: `✅ **Questões resolvidas:** ${questionsSolved}\n📅 **Questões hoje:** ${questionsToday}\n✍️ **Redações:** ${essaysGenerated}\n🎯 **Precisão:** ${precision}%\n📖 **Leitura:** ${readingHours}h\n⏱️ **Tempo economizado:** ${calcularTempoEconomizado(questionsSolved)}`,
                        inline: false
                    },
                    {
                        name: "🛡️ Conta",
                        value: `⭐ **Trust Score:** ${userData.trustScore ?? 100}/100\n⚠️ **Avisos:** ${userData.warnings ?? 0}\n🕒 **Última atividade:** ${formatDateTime(stats.lastActivity)}\n📅 **Criado em:** ${formatDate(userData.createdAt)}`,
                        inline: false
                    }
                )
                .setFooter({
                    text: "Omega Quantum • Plataforma Oficial"
                })
                .setTimestamp();

            return interaction.editReply({
                embeds: [embed]
            });

        } catch (err) {

            console.error(err);

            return interaction.editReply({
                content:
                    "<:recusado:1031262539272687777> Ocorreu um erro ao consultar este dispositivo."
            });

        }

    }
};
