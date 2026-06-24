# Deploy na Vercel

A aplicação fica em `plataforma/` (subdiretório), então o **Root Directory** do
projeto na Vercel deve ser `plataforma`. As migrations do banco são aplicadas
automaticamente no build (`prisma migrate deploy`).

## Pré-requisito: um PostgreSQL gerenciado (grátis)

Crie um banco em qualquer provedor e copie a **connection string**:
- **Neon** — https://neon.tech (recomendado, free) → copie a `DATABASE_URL` (com `?sslmode=require`).
- ou **Supabase**, **Railway**, **Vercel Postgres**.

## Opção A — Botão de deploy (mais simples)

> Requer que este código esteja no branch **default (main)** do repositório
> (o botão clona o branch padrão). Faça o merge do branch de feature antes,
> ou use a Opção B.

1. Clique em **Deploy** (botão no `README.md`).
2. Em **Root Directory**, escolha `plataforma`.
3. Preencha as variáveis de ambiente (veja a tabela abaixo).
4. Deploy. Acesse a URL e crie sua agência em `/registrar`.

## Opção B — CLI (a partir de qualquer branch)

```bash
cd plataforma
npm i -g vercel
vercel link            # cria/conecta o projeto
# configure as variáveis (uma vez):
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production           # https://SEU-PROJETO.vercel.app
vercel env add NEXT_PUBLIC_APP_URL production     # https://SEU-PROJETO.vercel.app
vercel env add INTEGRATION_ENCRYPTION_KEY production
vercel env add CRON_SECRET production
vercel env add DEMO_MODE production               # true (ou false p/ APIs reais)
vercel --prod          # deploy de produção
```

Defina o **Root Directory = `plataforma`** em Project → Settings → General.

## Variáveis de ambiente (mínimo para rodar)

| Variável | Como obter / valor |
|----------|--------------------|
| `DATABASE_URL` | Connection string do Postgres (Neon/Supabase/…) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL pública do projeto (`https://...vercel.app`) |
| `NEXT_PUBLIC_APP_URL` | mesma URL pública |
| `INTEGRATION_ENCRYPTION_KEY` | `openssl rand -base64 32` |
| `CRON_SECRET` | `openssl rand -hex 24` |
| `DEMO_MODE` | `true` (dados sintéticos) ou `false` (APIs reais) |

Opcionais (ativam recursos): `ANTHROPIC_API_KEY` (IA real), `RESEND_API_KEY` +
`EMAIL_FROM` (e-mail), `WHATSAPP_*` (WhatsApp), e as credenciais de cada
plataforma de anúncios (ver `docs/APIS.md`).

## Cron

`vercel.json` define **1 cron diário** (`/api/cron`, 09:00 UTC) — compatível com o
plano Hobby. Ele dispara os relatórios diários todo dia, os semanais às
segundas-feiras e os mensais no dia 1º. Proteja com `CRON_SECRET`.

## Pós-deploy

1. Acesse `https://SEU-PROJETO.vercel.app/registrar` e crie a agência (1º admin).
2. Cadastre clientes, conecte contas (demo ou OAuth real) e gere relatórios.
3. Health check: `GET /api/health`.
