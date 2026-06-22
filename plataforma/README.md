# Reportia — Relatórios de tráfego pago para agências

Plataforma SaaS **multi-tenant** que permite a agências de marketing digital conectarem
contas de anúncios (Meta, Google, TikTok, LinkedIn, GA4, Search Console), selecionarem um
cliente e gerarem **relatórios profissionais automáticos** — com análise por IA, exportação
em PDF, compartilhamento por link e envio por e-mail/WhatsApp.

> Interface moderna no estilo Looker Studio / Databox / Reportei, responsiva, com **tema claro
> e escuro**.

---

## ✨ Funcionalidades

| Área | Entregue |
|------|----------|
| **Dashboard** | Visão geral dos clientes, investimento, leads, CPL, ROAS e crescimento vs. período anterior |
| **Clientes** | Cadastro, logo, dados de contato, identidade visual e vínculo de contas de anúncios |
| **Integrações** | Adaptadores para Meta Ads, Google Ads, TikTok Ads, LinkedIn Ads, GA4 e Search Console |
| **Relatórios** | Geração diária/semanal/mensal, PDF, link público, envio por e-mail e WhatsApp, white-label |
| **Métricas** | Investimento, impressões, alcance, cliques, CPC, CPM, CTR, conversões, leads, CPL, receita, ROAS |
| **IA** | Resumo executivo, análise de desempenho, explicação de crescimento e sugestões de otimização |
| **Permissões** | Administrador, Gestor de tráfego e Cliente final (portal restrito) |

---

## 🧱 Stack

- **Front-end:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Recharts · next-themes
- **Back-end:** Route Handlers (Node.js) · Prisma ORM
- **Banco:** PostgreSQL
- **Auth:** NextAuth (JWT) com papéis e isolamento por agência
- **IA:** Anthropic Claude (com fallback determinístico)
- **PDF:** @react-pdf/renderer
- **Envio:** Resend (e-mail) · WhatsApp Cloud API
- **Hospedagem:** Vercel (+ Vercel Cron para automações)

---

## 🚀 Começando

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
#   edite DATABASE_URL e NEXTAUTH_SECRET (DEMO_MODE=true já vem ligado)

# 3. Criar o schema e popular dados de demonstração
npm run db:push
npm run db:seed

# 4. Subir em desenvolvimento
npm run dev
# → http://localhost:3000
```

### Banco local rápido (Docker)

```bash
docker run --name reportia-db -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=reportia -p 5432:5432 -d postgres:16
```

### 🔑 Credenciais de demonstração

| Papel | E-mail | Senha |
|-------|--------|-------|
| Administrador | `admin@demo.com` | `demo1234` |
| Gestor de tráfego | `gestor@demo.com` | `demo1234` |
| Cliente final | `cliente@demo.com` | `demo1234` |

> Com `DEMO_MODE=true`, as integrações geram **dados sintéticos realistas** — a plataforma
> funciona de ponta a ponta sem credenciais reais das APIs de anúncios.

---

## 📁 Estrutura

```
plataforma/
├── prisma/
│   ├── schema.prisma        # Modelo de dados multi-tenant
│   └── seed.ts              # Dados de demonstração
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login / cadastro
│   │   ├── (dashboard)/     # Área da agência (staff)
│   │   ├── portal/          # Portal do cliente final
│   │   ├── r/[token]/       # Relatório público (link compartilhável)
│   │   └── api/             # Route Handlers (REST)
│   ├── components/          # UI, dashboard, relatórios, integrações
│   └── lib/
│       ├── metrics.ts       # Cálculo de CPC/CPM/CTR/CPL/ROAS + crescimento
│       ├── integrations/    # Adaptadores por plataforma (+ modo demo)
│       ├── ai/              # Análise com Claude (+ fallback)
│       ├── pdf/             # Geração de PDF
│       └── reports/         # Build, geração, entrega e agendamento
└── docs/                    # Arquitetura, banco, telas, APIs, plano
```

---

## 📚 Documentação

- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — arquitetura completa
- [`docs/BANCO-DE-DADOS.md`](docs/BANCO-DE-DADOS.md) — estrutura do banco
- [`docs/FLUXO-DE-TELAS.md`](docs/FLUXO-DE-TELAS.md) — fluxo das telas
- [`docs/APIS.md`](docs/APIS.md) — APIs internas e externas necessárias
- [`docs/PLANO-DE-IMPLEMENTACAO.md`](docs/PLANO-DE-IMPLEMENTACAO.md) — plano em etapas

---

## ☁️ Deploy na Vercel

1. Importe o diretório `plataforma/` como projeto (Root Directory = `plataforma`).
2. Configure as variáveis de ambiente (ver `.env.example`).
3. Provisione um PostgreSQL gerenciado (Neon, Supabase, Railway…).
4. Os **Vercel Cron** já estão definidos em `vercel.json` (diário 09h, semanal seg., mensal dia 1º).

---

## ⚙️ Modos de operação

- **DEMO_MODE=true** → dados sintéticos, sem chamadas externas (ideal para avaliação).
- **DEMO_MODE=false** → usa os tokens reais (OAuth) salvos por integração. Cada plataforma
  é ativada conforme suas credenciais forem configuradas (ver `docs/APIS.md`).
