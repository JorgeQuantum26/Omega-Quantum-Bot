# 🏗️ Estrutura do Projeto

## 📂 Organização das Pastas

```
Omega-Quantum-Bot/
├── commands/                    # 📝 Todos os comandos slash
│   ├── Admin/                   # Categoria de comandos
│   │   └── ping.js             # Comando individual
│   └── Economia/                # Categoria
│       ├── Configurações/       # Subcategoria (suporta N níveis)
│       │   ├── usuario.js      # Comando válido ✅
│       │   └── invalido_exemplo.js # Comando inválido ❌
│       └── ...
│
├── src/
│   ├── config/
│   │   └── firebase.js         # 🔥 Inicialização Firebase Admin
│   ├── events/                 # 🎪 Event listeners
│   │   ├── ready.js
│   │   ├── interactionCreate.js
│   │   └── messageCreate.js
│   └── utils/
│       └── loaders.js          # 📂 Carregadores recursivos
│
├── index.js                    # 🚀 Arquivo principal (Discord.js v14)
├── package.json               # 📦 Dependências
├── .prettierrc                # 🎨 Configuração Prettier
├── .prettierignore            # 🎨 Arquivo ignore Prettier
└── .env.example              # 🔐 Variáveis de exemplo
```

---

## 🔥 Firebase Admin

O Firebase Admin SDK é **inicializado automaticamente** ao iniciar o bot.

### Como usar Firebase em seus comandos:

```javascript
import { db, auth } from "../src/config/firebase.js";

export default {
  data: new SlashCommandBuilder()
    .setName("exemplo")
    .setDescription("Comando com Firebase"),

  async execute(interaction) {
    // Usar Firestore
    const docRef = await db
      .collection("usuarios")
      .doc(interaction.user.id)
      .get();

    if (docRef.exists) {
      console.log("Dados:", docRef.data());
    }

    // Usar Authentication
    try {
      const user = await auth.getUser(interaction.user.id);
      console.log("Usuário:", user);
    } catch (error) {
      console.error("Erro:", error);
    }
  },
};
```

### Configuração do Firebase:

1. **Com arquivo JSON:**
   - Coloque `firebase-credentials.json` na raiz do projeto
   - O loader detectará e usará automaticamente

2. **Com variáveis de ambiente:**
   - Configure no arquivo `.env`:
     ```
     FIREBASE_PROJECT_ID=seu_project_id
     FIREBASE_PRIVATE_KEY="sua_private_key"
     FIREBASE_CLIENT_EMAIL=seu_client_email
     ```

---

## 📝 Estrutura de Comando

Todos os comandos devem seguir este padrão:

```javascript
import { SlashCommandBuilder } from "discord.js";

export default {
  // OBRIGATÓRIO - SlashCommandBuilder
  data: new SlashCommandBuilder()
    .setName("nome_do_comando")
    .setDescription("Descrição do comando"),

  // OBRIGATÓRIO - Função execute
  async execute(interaction) {
    await interaction.reply("Resposta do comando!");
  },
};
```

### ✅ Comandos válidos:
- Possuem `data` (SlashCommandBuilder)
- Possuem `execute` (async function)
- Estão em `commands/` (em qualquer profundidade de pasta)

### ❌ Comandos inválidos (serão ignorados):
- Não possuem `data` ou `execute`
- Não são arquivos `.js`
- Estão em outras pastas

---

## 🎪 Estrutura de Evento

Todos os eventos devem seguir este padrão:

```javascript
export default {
  // OBRIGATÓRIO - Nome do evento
  name: "ready",

  // OPCIONAL - Se deve ouvir apenas uma vez
  once: true,

  // OBRIGATÓRIO - Função execute
  execute(...args) {
    // Lógica do evento
  },
};
```

---

## 🎨 Prettier

### Formatos suportados:
- ✅ JavaScript
- ✅ JSON
- ✅ HTML
- ✅ CSS

### Comandos:

```bash
# Formatar todos os arquivos
npm run format

# Verificar se precisa formatação
npm run format:check
```

### Configurações:
- Semi-colons: ✅ Ativado
- Aspas simples: ❌ (usa duplas)
- Print width: 100
- Trailing comma: ES5
- Indentação: 2 espaços

---

## 🚀 Começando

### 1. Instalar dependências:
```bash
npm install
```

### 2. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

### 3. Iniciar o bot:
```bash
npm start      # Produção
npm run dev    # Desenvolvimento (com --watch)
```

---

## 📊 Exemplo de Saída ao Iniciar

```
📱 Omega Quantum Bot - v14

📂 Carregando eventos...
   Total: 3 | Carregados: 3 | Erros: 0
   ✅ ready.js                         -> ready
   ✅ interactionCreate.js             -> interactionCreate
   ✅ messageCreate.js                 -> messageCreate

📂 Carregando comandos...
   Total: 3 | Carregados: 2 | Erros: 1
   ✅ ping.js                          -> /ping
   ✅ usuario.js                       -> /usuario
   ❌ invalido_exemplo.js - Faltam propriedades obrigatórias (data, execute)

🔐 Autenticando no Discord...
✅ Bot conectado como OmegaBot#1234
```

---

## 💡 Dicas Úteis

- **Comandos recursivos:** Você pode criar subpastas infinitas dentro de `commands/`
- **Carregamento automático:** Não precisa registrar cada comando - o loader faz tudo
- **Validação automática:** Arquivos inválidos são detectados e reportados
- **Firebase global:** Importe `db` e `auth` de `src/config/firebase.js` em qualquer lugar
- **Múltiplos categorias:** Organize por `Economia`, `Admin`, `Diversão`, etc

---

