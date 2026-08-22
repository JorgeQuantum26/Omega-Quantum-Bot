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
#    - OMEGA_CORE_API_KEY (chave secreta da API central)

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

# API privada da plataforma central
OMEGA_CORE_API_KEY=gere_uma_chave_longa_e_aleatoria

# Configuração dos tickets Discord
SUPPORT_GUILD_ID=id_do_servidor_do_bot
SUPPORT_ROLE_ID=id_do_cargo_de_suporte
SUPPORT_CATEGORY_ID=id_da_categoria_de_tickets
```

## API do Omega Core

A API HTTP escuta na mesma porta do Render (`PORT`) e exige a chave em `x-api-key` ou `Authorization: Bearer ...`.

### Saúde do bot

```bash
curl https://seu-servico.onrender.com/api/health
```

### Consultar status

```bash
curl -H "x-api-key: SUA_CHAVE" \
   https://seu-servico.onrender.com/api/status
```

### Atualizar status

```bash
curl -X POST https://seu-servico.onrender.com/api/status \
   -H "Content-Type: application/json" \
   -H "x-api-key: SUA_CHAVE" \
   -d '{"tarefasp":"online","leitura":"maintenance"}'
```

Os valores aceitos são `online`, `offline` e `maintenance`.

### Criar um ticket de suporte

```bash
curl -X POST https://seu-servico.onrender.com/api/support/create-ticket \
   -H "Content-Type: application/json" \
   -H "x-api-key: SUA_CHAVE" \
   -d '{
      "email": "cliente@exemplo.com",
      "nome": "Nome do cliente",
      "plano": "anual",
      "discordID": "ID_DO_USUARIO"
   }'
```

O bot cria um canal com prefixo de prioridade (`[🔵]` normal, `[🟠]` alta ou `[🔴]` máxima), libera acesso somente ao cargo configurado, ao usuário informado e ao próprio bot, e envia a mensagem inicial com os dados do cliente. O bot precisa ter `Manage Channels`, `Manage Permissions` e `Send Messages` no servidor.

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

