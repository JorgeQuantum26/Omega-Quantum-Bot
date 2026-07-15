/**
 * @typedef {Object} CommandData
 * @property {import('discord.js').SlashCommandBuilder} data - SlashCommandBuilder
 * @property {Function} execute - Função para executar o comando
 */

/**
 * @typedef {Object} EventData
 * @property {string} name - Nome do evento Discord
 * @property {boolean} [once] - Se deve ouvir apenas uma vez
 * @property {Function} execute - Função para executar o evento
 */

/**
 * Exemplo de comando com funcionalidades avançadas
 * Este arquivo demonstra como:
 * - Usar subcomandos
 * - Validar permissões
 * - Usar Firebase Firestore
 * - Tratamento de erros
 */

const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
// const { db } = require("../../src/config/firebase.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configurações do servidor")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub.setName("prefixo").setDescription("Definir prefixo do servidor")
        .addStringOption((option) =>
          option
            .setName("novo_prefixo")
            .setDescription("O novo prefixo")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("idioma").setDescription("Definir idioma do servidor")
        .addStringOption((option) =>
          option
            .setName("idioma")
            .setDescription("Idioma desejado")
            .setRequired(true)
            .addChoices(
              { name: "Português", value: "pt" },
              { name: "Inglês", value: "en" },
              { name: "Espanhol", value: "es" }
            )
        )
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommand === "prefixo") {
        const novoPrefixo = interaction.options.getString("novo_prefixo");

        // Exemplo: Salvar no Firebase
        // await db
        //   .collection("servidores")
        //   .doc(interaction.guildId)
        //   .update({ prefixo: novoPrefixo });

        await interaction.reply(
          `✅ Prefixo atualizado para: \`${novoPrefixo}\``
        );
      }

      if (subcommand === "idioma") {
        const idioma = interaction.options.getString("idioma");

        // Exemplo: Salvar no Firebase
        // await db
        //   .collection("servidores")
        //   .doc(interaction.guildId)
        //   .update({ idioma });

        const nomes = { pt: "Português", en: "Inglês", es: "Espanhol" };
        await interaction.reply(`✅ Idioma definido para: ${nomes[idioma]}`);
      }
    } catch (error) {
      console.error("Erro em /config:", error);
      await interaction.reply({
        content: "❌ Erro ao atualizar configurações",
        ephemeral: true,
      });
    }
  },
};
