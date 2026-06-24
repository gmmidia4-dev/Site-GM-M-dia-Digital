# Arquitetura — Reportia

## 1. Visão geral

Reportia é uma aplicação **Next.js full-stack** (App Router) com banco **PostgreSQL** via
**Prisma**. É **multi-tenant**: cada *Agência* é um tenant isolado; todos os dados (clientes,
integrações, métricas, relatórios) pertencem a uma agência e o acesso é filtrado por
`agencyId` + papel do usuário.

```
┌──────────────────────────────────────────────────────────────────────┐
│                              NAVEGADOR                                 │
│   Staff (agência)        Cliente final         Link público           │
│   /dashboard …           /portal               /r/:token              │
└───────────┬───────────────────┬───────────────────┬───────────────────┘
            │                   │                   │
            ▼                   ▼                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      NEXT.JS (Vercel) — App Router                     │
│                                                                        │
│  Server Components  ──►  lib/* (regras de negócio)                     │
│  Route Handlers (/api)   ├─ metrics.ts      (CPC/CPM/CTR/CPL/ROAS)     │
│  Middleware (RBAC)       ├─ rbac.ts         (autorização)             │
│  next-auth (JWT)         ├─ reports/*       (build/generate/deliver)   │
│                          ├─ integrations/*  (adaptadores)             │
│                          ├─ ai/analyze.ts   (Claude)                  │
│                          └─ pdf/*           (@react-pdf)              │
│                                                                        │
│  Vercel Cron ──► /api/cron/{daily,weekly,monthly}                     │
└───────┬───────────────────────────┬───────────────────┬───────────────┘
        │                           │                   │
        ▼                           ▼                   ▼
┌───────────────┐        ┌───────────────────┐  ┌──────────────────────┐
│  PostgreSQL   │        │  APIs externas     │  │  Entrega             │
│  (Prisma)     │        │  Meta / Google /   │  │  Resend (e-mail)     │
│               │        │  TikTok / LinkedIn │  │  WhatsApp Cloud API  │
│               │        │  GA4 / SearchCons. │  │  Anthropic (IA)      │
└───────────────┘        └───────────────────┘  └──────────────────────┘
```

## 2. Camadas

### 2.1 Apresentação (UI)
- **Server Components** para páginas que leem dados (dashboard, listas, detalhes, relatório
  público) — renderização no servidor, sem expor o banco ao cliente.
- **Client Components** para interações (formulários, ações de relatório, toggle de tema,
  gráficos Recharts).
- **Tailwind + CSS variables** com tema claro/escuro (`next-themes`, estratégia `class`).
- **White-label:** cabeçalho do relatório usa as cores/logo da agência (ou override do
  cliente).

### 2.2 Aplicação (regras de negócio em `src/lib`)
- `metrics.ts` — agrega contadores brutos e deriva indicadores; calcula crescimento e
  define se a variação é favorável (ex.: ROAS↑ bom, CPL↑ ruim).
- `reports/build.ts` — monta o `ReportData` (KPIs comparados, série temporal, quebra por
  plataforma, top campanhas, branding).
- `reports/generate.ts` — orquestra: sincroniza integrações → agrega → IA → snapshot → READY.
- `reports/deliver.ts` — envia pelos canais e registra `ReportDelivery`.
- `reports/cron.ts` — executa agendamentos por frequência.
- `integrations/*` — um **adaptador por plataforma** implementando `PlatformAdapter`.
- `ai/analyze.ts` — gera as 4 análises via Claude (com fallback determinístico).
- `pdf/*` — documento PDF profissional.

### 2.3 Dados (Prisma/PostgreSQL)
- Granularidade base: **`MetricDaily`** (uma linha por integração/dia/campanha) com
  contadores brutos. Indicadores são derivados em runtime — evita inconsistências e permite
  recomposição flexível por período.
- **Snapshot imutável:** ao gerar um relatório, o `ReportData` agregado é salvo em
  `Report.dataSnapshot` (JSON). O relatório permanece fiel mesmo que dados mudem depois.

## 3. Multi-tenancy e segurança

- **Isolamento por tenant:** toda query de staff filtra por `agencyId` (vindo do JWT). Toda
  rota sensível passa por `requireUser` / `requireStaff` / `requireRole` (`src/lib/rbac.ts`).
- **RBAC (3 papéis):**
  - `ADMIN` — acesso total à agência + configurações/white-label.
  - `MANAGER` (gestor de tráfego) — clientes, integrações e relatórios.
  - `CLIENT` (cliente final) — apenas o **portal** com os relatórios dos clientes vinculados
    (`ClientUser`). O `middleware.ts` redireciona o CLIENT para fora das áreas de staff.
- **Tokens de integração cifrados** em repouso (AES-256-GCM, `src/lib/crypto.ts`); nunca são
  retornados pela API (`/api/integrations` remove os campos de token).
- **Link público** de relatório usa um **token aleatório** não adivinhável (`shareToken`),
  somente leitura.
- **Cron protegido** por `CRON_SECRET` (Bearer).

## 4. Fluxo de geração de relatório

```
Staff cria relatório (cliente + período)
        │
        ▼
POST /api/reports ──► generateReport()
        │                 ├─ 1. syncIntegration() para cada conta conectada
        │                 │      (adaptador busca insights → upsert MetricDaily)
        │                 ├─ 2. buildReportData() agrega + compara período anterior
        │                 ├─ 3. analyzeReport() (IA) → AiInsight x4
        │                 └─ 4. salva dataSnapshot + shareToken → status READY
        ▼
Visualização: /relatorios/:id (staff) · /r/:token (público) · PDF (/api/reports/:id/pdf)
        │
        ▼
Entrega: deliverReport() → e-mail (Resend) / WhatsApp / link  → ReportDelivery
```

## 5. Integrações (padrão Adapter)

Cada plataforma implementa a interface `PlatformAdapter` (`getAuthUrl`, `exchangeCode`,
`fetchInsights`). Vantagens:
- Adicionar uma nova fonte = criar um arquivo de adaptador + registrá-lo no índice.
- **Modo demo** (`DEMO_MODE`) usa um gerador determinístico — desenvolvimento e avaliação
  sem credenciais.
- Os indicadores são **normalizados** para o mesmo formato (`DailyInsight`), então o resto
  do sistema é agnóstico à origem.

## 6. Automação (agendamentos)

- `ReportSchedule` define frequência, canais e destinatários por cliente.
- **Vercel Cron** chama `/api/cron/{daily,weekly,monthly}` que, via `runScheduled()`, gera e
  entrega os relatórios do período. Em escala, troca-se o processamento síncrono por uma
  fila (ver `docs/PLANO-DE-IMPLEMENTACAO.md`).

## 7. Decisões de projeto

| Decisão | Motivo |
|--------|--------|
| Métricas brutas + derivação em runtime | Flexibilidade de período e consistência dos KPIs |
| Snapshot JSON no relatório | Imutabilidade/auditoria do que foi entregue ao cliente |
| Adapter por plataforma + modo demo | Extensibilidade e produto funcional sem credenciais |
| NextAuth JWT (sem sessão no banco) | Simplicidade e escalabilidade serverless |
| IA com fallback determinístico | Produto nunca “quebra” sem chave de IA; custo opcional |
| @react-pdf/renderer | PDF nativo em serverless, sem headless Chrome |
