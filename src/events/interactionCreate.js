module.exports = {
  name: "interactionCreate",
  once: false,

  async execute(interaction) {
    // Se não for um comando slash, ignora
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(
        `❌ Comando não encontrado: ${interaction.commandName}`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Erro ao executar ${interaction.commandName}:`, error);
      await interaction.reply({
        content: "❌ Houve um erro ao executar este comando!",
        ephemeral: true,
      });
    }
  },
};
