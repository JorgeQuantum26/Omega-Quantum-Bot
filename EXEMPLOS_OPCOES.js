/**
 * EXEMPLOS DE TIPOS DE OPÇÕES
 * Use como referência para criar seus comandos
 */

// ==========================================
// STRING (Texto)
// ==========================================
// .addStringOption(option =>
//   option
//     .setName("texto")
//     .setDescription("Um texto qualquer")
//     .setRequired(true)
//     .setMaxLength(100)      // Máximo 100 caracteres
//     .setMinLength(1)         // Mínimo 1 caractere
//     .setChoices(
//       { name: "Opção 1", value: "valor1" },
//       { name: "Opção 2", value: "valor2" }
//     )
// )

// ==========================================
// INTEGER (Número inteiro)
// ==========================================
// .addIntegerOption(option =>
//   option
//     .setName("numero")
//     .setDescription("Um número de 1 a 100")
//     .setRequired(true)
//     .setMinValue(1)
//     .setMaxValue(100)
// )

// ==========================================
// NUMBER (Número decimal)
// ==========================================
// .addNumberOption(option =>
//   option
//     .setName("valor")
//     .setDescription("Um valor decimal")
//     .setRequired(true)
//     .setMinValue(0.1)
//     .setMaxValue(9999.99)
// )

// ==========================================
// BOOLEAN (Verdadeiro/Falso)
// ==========================================
// .addBooleanOption(option =>
//   option
//     .setName("ativado")
//     .setDescription("Ativar ou desativar")
//     .setRequired(true)
// )

// ==========================================
// USER (Usuário do Discord)
// ==========================================
// .addUserOption(option =>
//   option
//     .setName("usuario")
//     .setDescription("Selecione um usuário")
//     .setRequired(true)
// )
// // Obter na função:
// // const usuario = interaction.options.getUser("usuario");
// // console.log(usuario.id, usuario.username);

// ==========================================
// ROLE (Cargo do servidor)
// ==========================================
// .addRoleOption(option =>
//   option
//     .setName("cargo")
//     .setDescription("Selecione um cargo")
//     .setRequired(true)
// )
// // Obter na função:
// // const cargo = interaction.options.getRole("cargo");
// // console.log(cargo.name, cargo.id);

// ==========================================
// CHANNEL (Canal do servidor)
// ==========================================
// .addChannelOption(option =>
//   option
//     .setName("canal")
//     .setDescription("Selecione um canal")
//     .setRequired(true)
//     // .addChannelTypes(ChannelType.GuildText) // Apenas text
// )
// // Obter na função:
// // const canal = interaction.options.getChannel("canal");
// // console.log(canal.name, canal.id);

// ==========================================
// MENTIONABLE (Usuário ou Cargo)
// ==========================================
// .addMentionableOption(option =>
//   option
//     .setName("alvo")
//     .setDescription("Mention um usuário ou cargo")
//     .setRequired(true)
// )
// // Obter na função:
// // const alvo = interaction.options.getMentionable("alvo");

// ==========================================
// ATTACHMENT (Arquivo enviado)
// ==========================================
// .addAttachmentOption(option =>
//   option
//     .setName("arquivo")
//     .setDescription("Envie um arquivo")
//     .setRequired(true)
// )
// // Obter na função:
// // const arquivo = interaction.options.getAttachment("arquivo");
// // console.log(arquivo.url, arquivo.name, arquivo.size);

// ==========================================
// SUBCOMANDOS
// ==========================================
// .addSubcommand(sub =>
//   sub
//     .setName("criar")
//     .setDescription("Criar algo")
//     .addStringOption(option =>
//       option
//         .setName("nome")
//         .setDescription("Nome do item")
//         .setRequired(true)
//     )
// )
// .addSubcommand(sub =>
//   sub
//     .setName("deletar")
//     .setDescription("Deletar algo")
//     .addStringOption(option =>
//       option
//         .setName("id")
//         .setDescription("ID do item")
//         .setRequired(true)
//     )
// )
// // Obter na função:
// // const subcommand = interaction.options.getSubcommand();
// // if (subcommand === "criar") { ... }

// ==========================================
// PERMISSÕES ESPECIAIS
// ==========================================
// import { PermissionFlagsBits } from "discord.js";
// .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
// .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
// .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
// .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
// .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
// .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
// .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

// ==========================================
// RESPOSTAS
// ==========================================
// // Resposta pública
// await interaction.reply({
//   content: "Mensagem pública",
//   ephemeral: false
// });

// // Resposta privada (apenas você vê)
// await interaction.reply({
//   content: "Mensagem privada",
//   ephemeral: true
// });

// // Com embed
// import { EmbedBuilder } from "discord.js";
// const embed = new EmbedBuilder()
//   .setColor("#0099ff")
//   .setTitle("Título")
//   .setDescription("Descrição")
//   .addFields(
//     { name: "Campo 1", value: "Valor 1", inline: true }
//   );
// await interaction.reply({ embeds: [embed] });

// // Com botões
// import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
// const row = new ActionRowBuilder()
//   .addComponents(
//     new ButtonBuilder()
//       .setCustomId("botao1")
//       .setLabel("Clique aqui")
//       .setStyle(ButtonStyle.Primary)
//   );
// await interaction.reply({
//   content: "Com botão:",
//   components: [row]
// });

// // Aguardar resposta (defer)
// await interaction.deferReply();
// // ... fazer algo que demora
// await interaction.editReply("Resposta final!");
