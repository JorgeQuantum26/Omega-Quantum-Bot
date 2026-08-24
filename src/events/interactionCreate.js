const {
    ActionRowBuilder,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
} = require("discord.js");
const { db } = require("../config/firebase.js");

const SUPPORT_ROLE_ID = process.env.SUPPORT_ROLE_ID;
const TICKET_CLOSE_DELAY = 5000;
const PUNISHMENT_DURATION = 24 * 60 * 60 * 1000;

function isSupportStaff(interaction) {
    const member = interaction.member;
    return Boolean(
        member?.permissions?.has(PermissionFlagsBits.ManageChannels) ||
        (SUPPORT_ROLE_ID && member?.roles?.cache?.has(SUPPORT_ROLE_ID))
    );
}

async function deleteTicketChannel(interaction, reason) {
    setTimeout(async () => {
        try {
            await interaction.channel.delete(reason);
        } catch (error) {
            console.error("❌ Não foi possível fechar o ticket:", error.message);
        }
    }, TICKET_CLOSE_DELAY);
}

function createCloseModal(ticketId) {
    return new ModalBuilder()
        .setCustomId(`fechar_ticket_modal_${ticketId}`)
        .setTitle("Fechar ticket")
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("close_reason")
                    .setLabel("Motivo do fechamento")
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("Descreva por que este ticket está sendo fechado")
                    .setRequired(true)
                    .setMaxLength(1000)
            )
        );
}

function createPunishModal(ticketId, discordId) {
    return new ModalBuilder()
        .setCustomId(`punir_ticket_modal_${ticketId}_${discordId}`)
        .setTitle("Punir cliente")
        .addComponents(
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("punish_reason")
                    .setLabel("Motivo da punição")
                    .setStyle(TextInputStyle.Paragraph)
                    .setPlaceholder("Descreva o motivo da punição")
                    .setRequired(true)
                    .setMaxLength(1000)
            ),
            new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setCustomId("trust_score_amount")
                    .setLabel("Quanto de Pontos da conta a diminuir?")
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder("Exemplo: 10")
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(3)
            )
        );
}

async function handleCloseModal(interaction) {
    if (!isSupportStaff(interaction)) {
        return interaction.reply({
            content: "⛔ Apenas a equipe de suporte pode fechar tickets.",
            ephemeral: true,
        });
    }

    const ticketId = interaction.customId.slice("fechar_ticket_modal_".length);
    const reason = interaction.fields.getTextInputValue("close_reason").trim();
    const staffName = interaction.member?.displayName || interaction.user.username;
    await interaction.reply({
        content: "✅ Motivo registrado. O ticket será fechado em 5 segundos.",
        ephemeral: true,
    });
    await interaction.channel.send(
        `🔒 **Ticket fechado**\nTicket: ${ticketId}\nMotivo: ${reason}\nStaff: ${staffName} (${interaction.user.id})`
    );

    await db.collection("ticket").doc(ticketId).update({
        status: "resolvido",
        resolvidoPor: interaction.user.username,
        resolvidoPorId: interaction.user.id,
        resolvidoEm: new Date().toISOString(),
        mensagem: reason
    })
    await db.collection("ticket").doc("metricas").update({
        total_aberto: db.FieldValue.increment(-1),
        total_resolvidos: db.FieldValue.increment(1)
    })


    return deleteTicketChannel(interaction, `Ticket fechado por ${interaction.user.tag}.`);
}

async function handlePunishModal(interaction) {
    if (!isSupportStaff(interaction) || !interaction.memberPermissions?.has(PermissionFlagsBits.ModerateMembers)) {
        return interaction.reply({
            content: "⛔ Você não tem permissão para aplicar esta punição.",
            ephemeral: true,
        });
    }

    const punishmentMatch = interaction.customId.match(/^punir_ticket_modal_(.+)_(\d{17,20})$/);
    const reason = interaction.fields.getTextInputValue("punish_reason").trim();
    const amount = Number(interaction.fields.getTextInputValue("trust_score_amount"));

    if (!punishmentMatch || !Number.isInteger(amount) || amount < 1 || amount > 100) {
        return interaction.reply({
            content: "❌ Informe uma quantidade inteira de Trust Score entre 1 e 100.",
            ephemeral: true,
        });
    }

    const [, , discordId] = punishmentMatch;
    const ticketId = punishmentMatch[1];
    const staffName = interaction.member?.displayName || interaction.user.username;

    try {
        const member = await interaction.guild.members.fetch(discordId);
        if (!member.moderatable) {
            return interaction.reply({
                content: "❌ Não consigo moderar este usuário por causa da hierarquia de cargos.",
                ephemeral: true,
            });
        }

        const userQuery = await db.collection("users").where("discordID", "==", discordId).limit(1).get();
        if (!userQuery.empty) {
            const userDoc = userQuery.docs[0];
            const currentTrustScore = Number(userDoc.data().trustScore ?? 100);
            await userDoc.ref.update({
                trustScore: Math.max(0, currentTrustScore - amount),
                lastPunishment: {
                    amount: amount,
                    reason: reason,
                    ticketId: ticketId,
                    staffId: interaction.user.id,
                    staffTag: interaction.user.tag,
                    staffName: interaction.user.username,
                    createdAt: new Date().toISOString(),
                },
            });
        }

        await db.collection("ticket").doc(ticketId).update({
            status: "fechado",
            fechadoPor: interaction.user.username,
            fechadoPorId: interaction.user.id,
            fechadoEm: new Date().toISOString(),
            motivo: reason,
            pontosReduzidos: amount
        })
        await db.collection("ticket").doc("metricas").update({
            total_aberto: db.FieldValue.increment(-1),
            total_resolvidos: db.FieldValue.increment(1)
        })

        await interaction.reply({
            content: `⛔ Punição aplicada. Trust Score reduzido em ${amount} ponto(s). O ticket será fechado em 5 segundos.`,
            ephemeral: true,
        });
        await interaction.channel.send(
            `⛔ **Cliente punido**\nTicket: ${ticketId}\nMotivo: ${reason}\nTrust Score: -${amount}\nStaff: ${staffName} (${interaction.user.id})`
        );
        return deleteTicketChannel(interaction, `Punição aplicada por ${interaction.user.tag}.`);
    } catch (error) {
        console.error("❌ Erro ao aplicar punição:", error.message);
        if (interaction.replied || interaction.deferred) {
            return interaction.editReply({ content: "❌ Não foi possível concluir a punição." });
        }
        return interaction.reply({ content: "❌ Não foi possível aplicar a punição.", ephemeral: true });
    }
}

async function handleTicketButton(interaction) {
    if (!isSupportStaff(interaction)) {
        return interaction.reply({
            content: "⛔ Apenas a equipe de suporte pode usar estes botões.",
            ephemeral: true,
        });
    }

    if (interaction.customId.startsWith("fechar_ticket_")) {
        const ticketId = interaction.customId.slice("fechar_ticket_".length);
        return interaction.showModal(createCloseModal(ticketId));
    }

    const punishmentMatch = interaction.customId.match(/^punir_(.+)_(\d{17,20})$/);
    if (!punishmentMatch) {
        return interaction.reply({
            content: "❌ Este botão de ticket é inválido ou está corrompido.",
            ephemeral: true,
        });
    }

    const [, ticketId, discordId] = punishmentMatch;
    return interaction.showModal(createPunishModal(ticketId, discordId));
}

async function handleModalSubmit(interaction) {
    if (interaction.customId.startsWith("fechar_ticket_modal_")) {
        return handleCloseModal(interaction);
    }

    if (interaction.customId.startsWith("punir_ticket_modal_")) {
        return handlePunishModal(interaction);
    }
}

module.exports = {
    name: "interactionCreate",
    once: false,

    async execute(interaction) {
        if (interaction.isButton()) {
            return handleTicketButton(interaction);
        }

        if (interaction.isModalSubmit()) {
            return handleModalSubmit(interaction);
        }

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`❌ Comando não encontrado: ${interaction.commandName}`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Erro ao executar ${interaction.commandName}:`, error);

            const response = {
                content: "❌ Houve um erro ao executar este comando!",
                ephemeral: true,
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.editReply(response);
            } else {
                await interaction.reply(response);
            }
        }
    },
};
