const { db } = require("../config/firebase.js");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.log("📡 Evento logs ativo");

    try {
      const snapshot = await db.collection("service").doc("status").get();
      if (snapshot.exists) {
        console.log("📦 Status do Firebase:", snapshot.data());
      } else {
        console.log("⚠️  Nenhum documento encontrado em service/status");
      }
    } catch (error) {
      console.error("❌ Erro ao consultar Firestore:", error.message);
    }
  },
};