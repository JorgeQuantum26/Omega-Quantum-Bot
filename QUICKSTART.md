# 🚀 Guia Rápido - Omega Quantum Bot

## Instalação Rápida (30 segundos)

```bash
# 1. Instalar dependências
npm install

# 2. Copiar exemplo de ambiente
cp .env.example .env

# 3. Editar .env com seus tokens:
#    - DISCORD_TOKEN (discord.com/developers)
#    - DISCORD_CLIENT_ID
#    - Firebase (se usar)

# 4. Iniciar
npm start
```

---

## Estrutura de Pastas

```
commands/
├── Admin/
│   ├── ping.js ✅
│   └── config.js ✅
└── Economia/
    └── Configurações/
        ├── usuario.js ✅
        └── invalido_exemplo.js ❌
```

**Regra:** Qualquer arquivo `.js` em `commands/` que tenha `data` e `execute` será carregado automaticamente!

---

## Criar um Novo Comando

1. **Copiar template:**
   ```bash
   cp TEMPLATE_COMANDO.js commands/Economia/novo_comando.js
   ```

2. **Editar arquivo:**
   ```javascript
   export default {
     data: new SlashCommandBuilder()
       .setName("novo")
       .setDescription("Meu novo comando"),

     async execute(interaction) {
       await interaction.reply("Funciona!");
     },
   };
   ```

3. **Pronto!** Bot carrega automaticamente no próximo reinício

---

## Usar Firebase

### 1. Importar no seu comando:
```javascript
import { db, auth } from "../../src/config/firebase.js";
```

### 2. Usar normalmente:
```javascript
// Firestore
const doc = await db.collection("usuarios").doc(id).get();

// Auth
const user = await auth.getUser(id);
```

---

## Formatar Código

```bash
npm run format      # Formata tudo
npm run format:check # Verifica sem alterar
```

---

## Variáveis de Ambiente

```env
# Discord
DISCORD_TOKEN=seu_token
DISCORD_CLIENT_ID=seu_id

# Firebase (opcional)
FIREBASE_PROJECT_ID=seu_projeto
FIREBASE_PRIVATE_KEY=sua_chave
FIREBASE_CLIENT_EMAIL=seu_email
```

---

## Debugging

### Ver comandos carregados:
```
📂 Carregando comandos...
   Total: 3 | Carregados: 2 | Erros: 1
   ✅ ping.js                          -> /ping
   ❌ invalido_exemplo.js - Faltam propriedades...
```

### Ver eventos:
```
📂 Carregando eventos...
   ✅ ready.js                         -> ready
   ✅ interactionCreate.js             -> interactionCreate
```

---

## Documentação Completa

Veja [STRUCTURE.md](STRUCTURE.md) para documentação detalhada.

