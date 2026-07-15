<div align="center">

# Omega Quantum Bot

**Bot oficial da plataforma Omega Quantum**

Plataforma • Automação • Integração • Discord

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
[![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)]

---

### 🌐 Plataforma

**Website:** https://omega-site.web.app

**Aplicação:** https://app-omega-quantum.web.app

</div>

---

## 📋 Índice

- [Sobre](#sobre)
- [Objetivos](#objetivos)
- [Início Rápido](#início-rápido)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Uso do Firebase](#uso-do-firebase)
- [Comando de Desenvolvimento](#comando-de-desenvolvimento)

---

## Sobre

O **Omega Quantum Bot** é o bot oficial da plataforma **Omega Quantum**, desenvolvido para fornecer integração entre o Discord e os serviços da plataforma.

O projeto foi construído com foco em **escalabilidade**, **organização**, **segurança** e **manutenibilidade**, servindo como um dos principais componentes do ecossistema Omega Quantum.

Ao invés de funcionar apenas como um bot convencional, ele atua como uma camada de comunicação entre usuários, APIs, banco de dados e serviços internos da plataforma.

---

## 🎯 Objetivos

- ✅ Centralizar funcionalidades da plataforma dentro do Discord
- ✅ Integrar serviços internos da Omega Quantum
- ✅ Automatizar processos
- ✅ Facilitar a comunicação entre usuários e a plataforma
- ✅ Manter uma arquitetura modular e expansível
- ✅ Suportar pastas/categorias infinitas de comandos
- ✅ Código formatado automaticamente com Prettier

---

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 20+
- npm ou yarn
- Credenciais do Discord
- Credenciais do Firebase (opcional)

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/JorgeQuantum26/Omega-Quantum-Bot.git
cd Omega-Quantum-Bot

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 4. (Opcional) Adicionar firebase-credentials.json
# Coloque seu arquivo de credenciais na raiz do projeto

# 5. Iniciar o bot
npm start
```

### Desenvolvimento

```bash
# Com recarregamento automático
npm run dev

# Verificar formatação
npm run format:check

# Formatar código
npm run format
```

---

## 📁 Estrutura do Projeto

```
Omega-Quantum-Bot/
├── commands/
│   ├── Admin/
│   │   ├── ping.js          ✅ Comando válido
│   │   ├── config.js        ✅ Subcomandos avançados
│   │   └── ...
│   ├── Economia/
│   │   ├── Configurações/
│   │   │   ├── usuario.js   ✅ Comando válido
│   │   │   └── invalido.js  ❌ Será ignorado
│   │   └── ...
│   └── ... (suporte a N níveis de pastas)
│
├── src/
│   ├── config/
│   │   └── firebase.js           🔥 Inicialização Firebase
│   ├── events/
│   │   ├── ready.js              👋 Evento de conexão
│   │   ├── interactionCreate.js  🎮 Slash commands
│   │   └── messageCreate.js      💬 Mensagens
│   └── utils/
│       └── loaders.js            📂 Carregador recursivo
│
├── index.js                 🚀 Arquivo principal
├── package.json            📦 Dependências
├── .prettierrc             🎨 Config Prettier
├── .env.example            🔐 Variáveis de exemplo
└── STRUCTURE.md            📖 Documentação detalhada
```

**Para documentação completa, veja [STRUCTURE.md](STRUCTURE.md)**

---

## 🔥 Uso do Firebase

### Inicialização Automática

O Firebase Admin é inicializado automaticamente ao iniciar o bot. Não é preciso fazer nada!

### Usar em Comandos

```javascript
import { SlashCommandBuilder } from "discord.js";
import { db, auth } from "../src/config/firebase.js";

export default {
  data: new SlashCommandBuilder()
    .setName("meu_comando")
    .setDescription("Descrição"),

  async execute(interaction) {
    // Usar Firestore
    const doc = await db
      .collection("usuarios")
      .doc(interaction.user.id)
      .get();

    if (doc.exists) {
      console.log(doc.data());
    }

    // Usar Authentication
    const user = await auth.getUser(interaction.user.id);
    console.log(user);
  },
};
```

### Configuração

**Opção 1: Arquivo JSON**
```bash
# Coloque firebase-credentials.json na raiz
firebase-credentials.json
```

**Opção 2: Variáveis de Ambiente**
```env
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_PRIVATE_KEY="sua_chave_privada"
FIREBASE_CLIENT_EMAIL=seu_email@app.gserviceaccount.com
```

---

## 💻 Comandos de Desenvolvimento

```bash
# Iniciar em produção
npm start

# Iniciar com recarregamento automático
npm run dev

# Formatar todos os arquivos (JS, JSON, HTML, CSS)
npm run format

# Verificar formatação sem alterar
npm run format:check
```

---

## 🎨 Prettier

Todos os arquivos são automaticamente formatados com **Prettier**:

✅ JavaScript
✅ JSON
✅ HTML
✅ CSS

**Configuração:**
- Aspas duplas
- Ponto-vírgula obrigatório
- Largura: 100 caracteres
- Indentação: 2 espaços

---

## 📐 Estrutura de Comando

### Comando Simples ✅

```javascript
import { SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde com pong"),

  async execute(interaction) {
    await interaction.reply("🏓 Pong!");
  },
};
```

### Comando Inválido ❌

```javascript
// Faltam 'data' e 'execute' - será ignorado
export default {
  name: "invalido",
};
```

---

## 🏗️ Arquitetura

```text
                 Discord
                   │
                   ▼
           ┌──────────────────┐
           │  Omega Bot v14   │
           │   (index.js)     │
           └──────────────────┘
                   │
        ┌──────────┼──────────┬───────────┐
        │          │          │           │
        ▼          ▼          ▼           ▼
    Commands    Events     Firebase    Utilities
    (recursivo)  (listeners) (DB/Auth)  (loaders)
```

---

## ⚙️ Configuração do VSCode

Para melhor experiência, copie as configurações:

```bash
cp .vscode-settings.json .vscode/settings.json
```

Isso ativa:
- Formatação automática ao salvar
- Prettier como formatador padrão
- Exclusão de arquivos sensíveis da busca

---

## 📝 Estrutura de Arquivo


                                                           ▼
                                                                        Omega Quantum Bot
                                                                                             │
                                                                                                     ┌────────────┼────────────┐
                                                                                                             │            │            │
                                                                                                                     ▼            ▼            ▼
                                                                                                                        Firebase      APIs Internas   Serviços
                                                                                                                                │
                                                                                                                                        ▼
                                                                                                                                         Banco de Dados
                                                                                                                                         ```

                                                                                                                                         ---

                                                                                                                                         # Tecnologias

                                                                                                                                         | Tecnologia | Utilização |
                                                                                                                                         |------------|------------|
                                                                                                                                         | Node.js | Ambiente de execução |
                                                                                                                                         | Discord.js | Comunicação com a API do Discord |
                                                                                                                                         | Firebase Firestore | Banco de dados |
                                                                                                                                         | Firebase Authentication | Autenticação |
                                                                                                                                         | REST APIs | Comunicação entre serviços |
                                                                                                                                         | JavaScript | Desenvolvimento da aplicação |

                                                                                                                                         ---

                                                                                                                                         # Estrutura do Projeto

                                                                                                                                         ```text
                                                                                                                                         Omega-Bot
                                                                                                                                         │
                                                                                                                                         ├── commands/
                                                                                                                                         │   ├── slash/
                                                                                                                                         │   ├── context/
                                                                                                                                         │   └── interactions/
                                                                                                                                         │
                                                                                                                                         ├── events/
                                                                                                                                         │
                                                                                                                                         ├── services/
                                                                                                                                         │
                                                                                                                                         ├── utils/
                                                                                                                                         │
                                                                                                                                         ├── database/
                                                                                                                                         │
                                                                                                                                         ├── config/
                                                                                                                                         │
                                                                                                                                         ├── assets/
                                                                                                                                         │
                                                                                                                                         ├── index.js
                                                                                                                                         │
                                                                                                                                         └── package.json
                                                                                                                                         ```

                                                                                                                                         *A estrutura acima representa a organização lógica do projeto. Ela pode sofrer alterações conforme a evolução da aplicação.*

                                                                                                                                         ---

                                                                                                                                         # Filosofia do Projeto

                                                                                                                                         O desenvolvimento do Omega Quantum Bot segue alguns princípios fundamentais:

                                                                                                                                         - Código limpo
                                                                                                                                         - Separação de responsabilidades
                                                                                                                                         - Arquitetura modular
                                                                                                                                         - Facilidade de manutenção
                                                                                                                                         - Escalabilidade
                                                                                                                                         - Segurança
                                                                                                                                         - Reutilização de componentes

                                                                                                                                         Cada módulo possui uma responsabilidade específica, reduzindo acoplamentos e facilitando futuras expansões.

                                                                                                                                         ---

                                                                                                                                         # Integração com a Plataforma

                                                                                                                                         O bot faz parte do ecossistema **Omega Quantum**, trabalhando em conjunto com os demais serviços da plataforma.

                                                                                                                                         Essa integração permite que informações sejam compartilhadas entre diferentes componentes do sistema de forma organizada e segura.

                                                                                                                                         ---

                                                                                                                                         # Segurança

                                                                                                                                         Durante o desenvolvimento são adotadas boas práticas como:

                                                                                                                                         - Validação de dados recebidos
                                                                                                                                         - Controle de permissões
                                                                                                                                         - Proteção de credenciais por variáveis de ambiente
                                                                                                                                         - Separação entre ambiente de desenvolvimento e produção
                                                                                                                                         - Organização das configurações sensíveis

                                                                                                                                         ---

                                                                                                                                         # Desenvolvimento

                                                                                                                                         ## Clonar o projeto

                                                                                                                                         ```bash
                                                                                                                                         git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
                                                                                                                                         ```

                                                                                                                                         ## Instalar dependências

                                                                                                                                         ```bash
                                                                                                                                         npm install
                                                                                                                                         ```

                                                                                                                                         ## Configurar as variáveis de ambiente

                                                                                                                                         Crie um arquivo `.env` contendo as credenciais necessárias para execução do projeto.

                                                                                                                                         Exemplo:

                                                                                                                                         ```env
                                                                                                                                         DISCORD_TOKEN=
                                                                                                                                         CLIENT_ID=

                                                                                                                                         FIREBASE_PROJECT_ID=
                                                                                                                                         FIREBASE_PRIVATE_KEY=
                                                                                                                                         FIREBASE_CLIENT_EMAIL=
                                                                                                                                         ```

                                                                                                                                         ## Executar

                                                                                                                                         ```bash
                                                                                                                                         npm start
                                                                                                                                         ```

                                                                                                                                         ou

                                                                                                                                         ```bash
                                                                                                                                         node index.js
                                                                                                                                         ```

                                                                                                                                         ---

                                                                                                                                         # Organização

                                                                                                                                         O projeto busca manter uma estrutura simples, porém preparada para crescimento.

                                                                                                                                         Novas funcionalidades são implementadas de forma modular, permitindo evolução contínua sem comprometer a estabilidade do sistema.

                                                                                                                                         ---

                                                                                                                                         # Roadmap

                                                                                                                                         - [ ] Melhorias na arquitetura interna
                                                                                                                                         - [ ] Expansão das integrações
                                                                                                                                         - [ ] Otimizações de desempenho
                                                                                                                                         - [ ] Ampliação da documentação
                                                                                                                                         - [ ] Novos serviços para o ecossistema Omega Quantum

                                                                                                                                         ---

                                                                                                                                         # Contribuição

                                                                                                                                         Este é um projeto de desenvolvimento privado.

                                                                                                                                         Contribuições externas podem ser consideradas futuramente conforme a evolução da plataforma.

                                                                                                                                         ---

                                                                                                                                         # Licença

                                                                                                                                         Este repositório é de uso privado.

                                                                                                                                         Todos os direitos sobre o código pertencem ao projeto **Omega Quantum**.

                                                                                                                                         ---

                                                                                                                                         <div align="center">

                                                                                                                                         ## Omega Quantum

                                                                                                                                         **Tecnologia • Automação • Inovação**

                                                                                                                                         Desenvolvido com dedicação para construir uma plataforma cada vez mais completa.

                                                                                                                                         </div>