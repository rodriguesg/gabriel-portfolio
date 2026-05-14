#!/bin/bash
# ================================================
# Script para subir o portfolio no GitHub
# Repositório: rodriguesg/gabriel-portfolio
# ================================================

set -e

echo "🚀 Iniciando setup do repositório..."

# 1. Entrar na pasta do projeto
cd portfolio

# 2. Criar .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.DS_Store
*.local
.env
.env.*
terraform/.terraform/
terraform/*.tfstate
terraform/*.tfstate.backup
terraform/.terraform.lock.hcl
terraform/terraform.tfvars
EOF

# 3. Inicializar Git
git init
git branch -M main

# 4. Adicionar todos os arquivos
git add .

# 5. Commit inicial
git commit -m "feat: portfolio inicial — React + Vite + AWS Terraform

- Frontend React 18 com design system dark/cyberpunk
- Seções: Hero, About, Experience, Skills, Certs, Projects, Contact
- Canvas interativo com grid de pontos no Hero
- Typewriter effect e custom cursor
- Infra AWS com Terraform (S3 + CloudFront + ACM + Route53)
- GitHub Actions CI/CD pipeline
- Dados reais: Gabriel Rodrigues @ Itaú Unibanco"

# 6. Conectar ao repositório remoto
git remote add origin https://github.com/rodriguesg/gabriel-portfolio.git

# 7. Push
git push -u origin main

echo ""
echo "✅ Portfolio publicado com sucesso!"
echo "🔗 https://github.com/rodriguesg/gabriel-portfolio"
echo ""
echo "📋 Próximos passos:"
echo "   1. Editar terraform/terraform.tfvars com seu domínio"
echo "   2. cd terraform && terraform init && terraform apply"
echo "   3. npm run build && fazer deploy no S3 (ver README)"
