const { SlashCommandBuilder } = require("discord.js");
// Se precisar do Firebase em comandos, importe assim:
// const { db, auth } = require("../../src/config/firebase.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde com pong!"),

  async execute(interaction) {
    await interaction.reply("🏓 Pong!");
  },
};
