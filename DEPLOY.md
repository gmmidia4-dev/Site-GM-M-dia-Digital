# GM Mídia Digital — Guia de Deploy

## Requisitos
- VPS Ubuntu 22.04+ com 2GB+ RAM
- Docker e Docker Compose instalados
- Domínio apontando para o IP do servidor

## 1. Configurar Servidor

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y
```

## 2. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/gm-midia-digital.git
cd gm-midia-digital
```

## 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
nano .env
```

Preencha todas as variáveis:
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_SEGURA@postgres:5432/gm_midia_digital"
NEXTAUTH_URL="https://seudominio.com.br"
NEXTAUTH_SECRET="gere-com: openssl rand -base64 32"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="seu@email.com"
SMTP_PASS="sua-senha-de-app-gmail"
NOTIFICATION_EMAIL="contato@gmmidia.com.br"
NEXT_PUBLIC_SITE_URL="https://seudominio.com.br"
NEXT_PUBLIC_WHATSAPP_NUMBER="5511999999999"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="SUA_SENHA_SEGURA"
POSTGRES_DB="gm_midia_digital"
```

## 4. SSL com Let's Encrypt

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d seudominio.com.br -d www.seudominio.com.br
```

## 5. Atualizar nginx.conf

Edite `nginx.conf` e substitua `gmmidia.com.br` pelo seu domínio real.

## 6. Build e Deploy

```bash
# Build das imagens
docker compose build

# Subir serviços
docker compose up -d

# Verificar logs
docker compose logs -f app

# Rodar migrações do banco
docker compose exec app npx prisma migrate deploy

# Seed inicial (cria admin + dados de exemplo)
docker compose exec app npx tsx prisma/seed.ts
```

## 7. Acesso ao Painel Admin

URL: `https://seudominio.com.br/admin/login`
Email: `admin@gmmidia.com.br`
Senha: `admin@GM2024!`

**⚠️ ALTERE A SENHA imediatamente após o primeiro acesso!**

## 8. Comandos Úteis

```bash
# Reiniciar app
docker compose restart app

# Ver logs em tempo real
docker compose logs -f app

# Backup do banco
docker compose exec postgres pg_dump -U postgres gm_midia_digital > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker compose exec -T postgres psql -U postgres gm_midia_digital < backup.sql

# Atualizar aplicação
git pull
docker compose build app
docker compose up -d app
docker compose exec app npx prisma migrate deploy
```

## 9. Renovação Automática do SSL

```bash
# Adicionar ao crontab
crontab -e
# Adicionar linha:
0 12 * * * /usr/bin/certbot renew --quiet && docker compose restart nginx
```

## Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── (site)/            # Páginas públicas do site
│   ├── admin/             # Painel administrativo
│   └── api/               # API Routes
├── components/
│   ├── site/              # Componentes do site público
│   ├── admin/             # Componentes do painel admin
│   └── ui/                # Componentes base (Shadcn)
├── lib/                   # Utilitários (auth, db, email)
├── prisma/                # Schema e seeds do banco
├── public/                # Arquivos estáticos
├── docker-compose.yml     # Orquestração Docker
├── Dockerfile             # Build da aplicação
└── nginx.conf             # Configuração do Nginx
```
