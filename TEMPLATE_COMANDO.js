/**
 * TEMPLATE DE COMANDO
 * Copie este arquivo e adapte para seus comandos
 */

const { SlashCommandBuilder } = require("discord.js");
// const { db, auth } = require("../../src/config/firebase.js");

/**
 * COMANDO BÁSICO
 * Use este template para comandos simples
 */

module.exports = {
  // =========== DADOS DO COMANDO ===========
  data: new SlashCommandBuilder()
    .setName("nome_do_comando") // Nome em lowercase
    .setDescription("Uma descrição curta do comando"),
  // .setDMPermission(false)                    // Desabilitar em DMs
  // .setDefaultMemberPermissions(0)            // Sem permissões especiais
  // .setNSFW(false)                            // Não é NSFW

  // =========== OPÇÕES (parâmetros) ===========
  // Descomente para adicionar:
  // .addStringOption(option =>
  //   option
  //     .setName("parametro")
  //     .setDescription("Descrição do parâmetro")
  //     .setRequired(true)
  // )
  // .addIntegerOption(option =>
  //   option
  //     .setName("numero")
  //     .setDescription("Um número")
  //     .setRequired(false)
  //     .setMinValue(1)
  //     .setMaxValue(100)
  // )
  // .addUserOption(option =>
  //   option
  //     .setName("usuario")
  //     .setDescription("Selecione um usuário")
  //     .setRequired(false)
  // )
  // .addRoleOption(option =>
  //   option
  //     .setName("cargo")
  //     .setDescription("Selecione um cargo")
  //     .setRequired(false)
  // )
  // .addChannelOption(option =>
  //   option
  //     .setName("canal")
  //     .setDescription("Selecione um canal")
  //     .setRequired(false)
  // )

  // =========== FUNÇÃO PRINCIPAL ===========
  async execute(interaction) {
    // Obter parâmetros (se houver)
    // const parametro = interaction.options.getString("parametro");
    // const numero = interaction.options.getInteger("numero");
    // const usuario = interaction.options.getUser("usuario");
    // const cargo = interaction.options.getRole("cargo");
    // const canal = interaction.options.getChannel("canal");

    try {
      // Sua lógica aqui
      await interaction.reply({
        content: "✅ Comando executado com sucesso!",
        ephemeral: false, // true = apenas você vê a mensagem
      });

      // EXEMPLO: Usar Firebase
      // const docRef = await db
      //   .collection("dados")
      //   .doc(interaction.user.id)
      //   .get();
      // if (docRef.exists) {
      //   console.log(docRef.data());
      // }
    } catch (error) {
      console.error("Erro no comando:", error);
      await interaction.reply({
        content: "❌ Ocorreu um erro!",
        ephemeral: true,
      });
    }
  },
};
