# 🐛 Troubleshooting - Problemas Comuns

## Bot não conecta

### ❌ Erro: `token was invalid`
```
DISCORD_TOKEN no .env está incorreto
```
**Solução:**
1. Vá para [discord.com/developers](https://discord.com/developers)
2. Selecione sua aplicação
3. Copie o token em Applications > Bot > TOKEN
4. Cole no `.env`

---

## Comandos não aparecem

### ❌ Erro: Nenhum comando é carregado
```
📂 Carregando comandos...
   Total: 0 | Carregados: 0 | Erros: 0
```
**Solução:**
- Verifique se existe pasta `commands/`
- Crie um comando em `commands/Admin/ping.js`
- Reinicie o bot

### ❌ Erro: Comando desaparece após reload
Discord sincroniza comandos a cada 1-5 minutos. Aguarde.

---

## Firebase não funciona

### ❌ Erro: `FIREBASE_PROJECT_ID is required`
```
❌ Erro ao inicializar Firebase Admin
```
**Solução (escolha uma):**

**Opção 1 - Arquivo JSON:**
1. Baixe `firebase-credentials.json` do Firebase Console
2. Coloque na raiz do projeto
3. Reinicie o bot

**Opção 2 - Variáveis:**
1. Configure em `.env`:
   ```env
   FIREBASE_PROJECT_ID=seu_project_id
   FIREBASE_PRIVATE_KEY="sua_chave_com_\n_escaped"
   FIREBASE_CLIENT_EMAIL=seu_email@app.gserviceaccount.com
   ```
2. Reinicie o bot

---

## Arquivo inválido

### ❌ Aviso: `Faltam propriedades obrigatórias`
```
❌ invalido.js - Faltam propriedades obrigatórias (data, execute)
```
**Solução:**
Todo arquivo em `commands/` deve ter:
```javascript
export default {
  data: new SlashCommandBuilder()...,
  async execute(interaction) { ... }
};
```

---

## Prettier não funciona

### ❌ Erro: `prettier: command not found`
```bash
npm install --save-dev prettier
npm run format
```

---

## Node modules não instalam

### ❌ Erro: `npm ERR! code ERESOLVE`
```bash
# Tente:
npm install --legacy-peer-deps

# Ou limpe tudo:
rm -rf node_modules package-lock.json
npm install
```

---

## Porta já em uso (se estiver rodando servidor)

### ❌ Erro: `Port 3000 already in use`
```bash
# Encontre o processo:
lsof -i :3000

# Mate o processo:
kill -9 <PID>

# Ou mude a porta no .env
PORT=3001
```

---

## Permissões do bot

### ❌ Bot diz: `Missing Permissions`

Verifique que o bot tem permissões:
1. Discord > Server Settings > Roles
2. Encontre o role do bot
3. Dê as permissões necessárias
4. Coloque acima dos roles que ele precisa gerenciar

---

## Erro de tipos (TypeScript)

### ❌ VSCode mostra erros de tipo

Se estiver usando JavaScript puro (recomendado), desative validação:
1. Command Palette: `Preferences: Open Settings (JSON)`
2. Adicione:
   ```json
   "js/ts.implicitProjectConfig.checkJs": false
   ```

---

## Memory leak ou bot trava

### ❌ Bot consome 100% CPU
```bash
# Veja logs detalhados:
npm run dev

# Procure por loops infinitos ou listeners não removidos
```

---

## Evento não dispara

### ❌ Event listener não funciona

Verifique:
1. Arquivo está em `src/events/` ✅
2. Tem propriedades `name` e `execute` ✅
3. Nome do evento está correto:
   ```javascript
   name: "ready"  // ✅ Correto
   name: "Ready"  // ❌ Errado (case sensitive)
   ```

---

## Mudei código mas nada muda

### ❌ Mudanças não refletem

Tente:
```bash
# Parar o bot (Ctrl+C)
# Limpar cache
rm -rf .cache/

# Reiniciar
npm start
# Ou com reload automático:
npm run dev
```

---

## Precisa de ajuda?

1. Veja [STRUCTURE.md](STRUCTURE.md) - Documentação completa
2. Veja [QUICKSTART.md](QUICKSTART.md) - Guia rápido
3. Veja [EXEMPLOS_OPCOES.js](EXEMPLOS_OPCOES.js) - Exemplos de código
