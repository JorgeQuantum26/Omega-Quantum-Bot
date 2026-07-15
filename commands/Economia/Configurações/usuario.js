const { SlashCommandBuilder } = require("discord.js");
// Exemplo de uso do Firebase
// const { db } = require("../../../src/config/firebase.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("usuario")
    .setDescription("Mostra informações do usuário"),

  async execute(interaction) {
    const user = interaction.user;
    await interaction.reply(
      `Olá ${user.username}#${user.discriminator}!\nID: ${user.id}`
    );

    // Exemplo de como usar Firebase:
    // const docRef = await db.collection("usuarios").doc(user.id).get();
    // if (docRef.exists) {
    //   console.log("Dados do usuário:", docRef.data());
    // }
  },
};
