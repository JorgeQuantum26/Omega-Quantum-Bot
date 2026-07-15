const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

function normalizePrivateKey(value) {
  if (typeof value !== "string") return value;

  return value
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\n")
    .trim();
}

// Inicializar Firebase Admin SDK
try {
  // Se estiver usando arquivo de credenciais JSON
  const credentialsPath = path.join(__dirname, "../firebase-credentials.json");

  if (fs.existsSync(credentialsPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
    serviceAccount.private_key = normalizePrivateKey(serviceAccount.private_key);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_CREDENTIALS_JSON) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_CREDENTIALS_JSON
    );
    serviceAccount.private_key = normalizePrivateKey(serviceAccount.private_key);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Se estiver usando variáveis de ambiente
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  console.log("✅ Firebase Admin inicializado com sucesso!");
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase Admin:", error.message);
  process.exit(1);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
