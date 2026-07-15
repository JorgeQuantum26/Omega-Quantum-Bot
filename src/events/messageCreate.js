module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message) {
    // Ignora mensagens do bot
    if (message.author.bot) return;

    // Exemplo: Log de mensagens
    // console.log(`[${message.guild?.name}] ${message.author.tag}: ${message.content}`);
  },
};
