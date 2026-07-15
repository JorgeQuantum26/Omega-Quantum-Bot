#!/bin/bash

# 🚀 Script de Setup Inicial - Omega Quantum Bot
# Execute este script uma única vez para configurar tudo

echo "📱 Omega Quantum Bot - Setup Inicial"
echo "===================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Verificar Node.js
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado! Instale em https://nodejs.org/${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION}${NC}"
echo ""

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependências instaladas${NC}"
echo ""

# 3. Copiar arquivo de ambiente
echo "🔐 Configurando variáveis de ambiente..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
    echo -e "${YELLOW}⚠️  Edite .env com seus tokens do Discord e Firebase${NC}"
else
    echo -e "${YELLOW}⚠️  Arquivo .env já existe, pulando...${NC}"
fi
echo ""

# 4. Criar pasta de credenciais (opcional)
echo "🔥 Criando pasta para firebase-credentials.json..."
echo -e "${YELLOW}💡 Se tiver firebase-credentials.json, coloque na raiz do projeto${NC}"
echo ""

# 5. Resumo
echo "===================================="
echo -e "${GREEN}✅ Setup Concluído!${NC}"
echo "===================================="
echo ""
echo "📝 Próximos passos:"
echo "1. Edite .env com seus tokens:"
echo "   - DISCORD_TOKEN"
echo "   - DISCORD_CLIENT_ID"
echo "   - Firebase (opcional)"
echo ""
echo "2. Inicie o bot:"
echo "   npm start       (Produção)"
echo "   npm run dev     (Desenvolvimento com reload)"
echo ""
echo "3. Consulte a documentação:"
echo "   - README.md            (Visão geral)"
echo "   - QUICKSTART.md        (Guia rápido)"
echo "   - STRUCTURE.md         (Documentação completa)"
echo "   - TEMPLATE_COMANDO.js  (Template de comando)"
echo ""
echo "🚀 Boa sorte!"
echo ""
