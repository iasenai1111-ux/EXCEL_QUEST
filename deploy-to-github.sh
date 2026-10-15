#!/usr/bin/env bash
# Script para envio automático ao GitHub Pages
set -e

echo "=========================================================="
echo "🚀 SUPER SENAI BROS: EXCEL WORLD — Publicação GitHub Pages"
echo "Repositório: https://github.com/iasenai1111-ux/EXCEL_QUEST.git"
echo "=========================================================="

# Build do projeto
echo "📦 Gerando build de produção otimizado..."
npm run build

# Adicionando commit atual caso haja alterações
git add .
if ! git diff-index --quiet HEAD --; then
  git commit -m "feat: Painel do Professor Root, Gabaritos, Modo Imortal e Áudio Rock Kansas"
fi

# Configuração do remote
git remote set-url origin https://github.com/iasenai1111-ux/EXCEL_QUEST.git 2>/dev/null || git remote add origin https://github.com/iasenai1111-ux/EXCEL_QUEST.git

echo ""
echo "📤 Para enviar o código ao GitHub, execute:"
echo "   git push -u origin HEAD:main"
echo ""
echo "💡 Caso utilize Personal Access Token (PAT) do GitHub:"
echo "   git push https://<SEU_TOKEN_GITHUB>@github.com/iasenai1111-ux/EXCEL_QUEST.git HEAD:main"
echo ""
echo "✅ Workflow do GitHub Actions (.github/workflows/deploy.yml) já configurado!"
echo "   O GitHub Pages será publicado automaticamente em:"
echo "   https://iasenai1111-ux.github.io/EXCEL_QUEST/"
echo "=========================================================="
