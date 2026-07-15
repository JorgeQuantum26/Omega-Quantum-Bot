module.exports = {
  name: "ready",
  once: true,

  execute(client) {
    console.log(`\n✅ Bot conectado como ${client.user.tag}\n`);
    client.user.setActivity("🎮 Omega Quantum", { type: "WATCHING" });
  },
};
