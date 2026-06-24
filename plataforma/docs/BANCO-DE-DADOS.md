# Estrutura do banco de dados — Reportia

Fonte da verdade: [`prisma/schema.prisma`](../prisma/schema.prisma) (PostgreSQL).
Este documento descreve as entidades, relações e os índices/decisões.

## Diagrama de entidades (ER)

```
Agency (tenant)
  ├─1:N─ User ───────────────┐
  │        └─ ClientUser ─┐  │ (NextAuth: Account, Session)
  ├─1:N─ Client ──────────┼──┘
  │        ├─1:N─ Integration ─1:N─ MetricDaily
  │        ├─1:N─ Report ─┬─1:N─ AiInsight
  │        │              └─1:N─ ReportDelivery
  │        └─1:N─ ReportSchedule
  └─1:N─ ActivityLog
```

## Tabelas

### `Agency` — tenant (a agência)
Raiz do isolamento multi-tenant. Guarda **identidade visual** (white-label) aplicada aos
relatórios: `brandPrimary`, `brandSecondary`, `logoUrl`. Campos: `slug` (único), `plan`.

### `User` — usuários da agência
`role ∈ {ADMIN, MANAGER, CLIENT}`, `password` (hash bcrypt, opcional p/ login social),
`agencyId`. Relaciona com `ClientUser` (quando CLIENT). Tabelas `Account`/`Session`/
`VerificationToken` dão suporte ao NextAuth.

### `Client` — clientes da agência
Dados do cliente, **logo**, **contato** (`contactEmail`, `contactPhone` usado no WhatsApp) e
override opcional de cor (`brandPrimary`). `isActive` para arquivar sem apagar histórico.

### `ClientUser` — vínculo cliente-final ↔ cliente
Permite que um usuário `CLIENT` veja **apenas** os clientes vinculados. Único por
`(userId, clientId)`.

### `Integration` — conta de anúncios conectada
`platform ∈ {META_ADS, GOOGLE_ADS, TIKTOK_ADS, LINKEDIN_ADS, GA4, SEARCH_CONSOLE}`,
`status`, `externalAccountId`, **tokens OAuth cifrados** (`accessToken`/`refreshToken`),
`expiresAt`, `lastSyncedAt`. Único por `(agencyId, platform, externalAccountId)`.

### `MetricDaily` — métricas diárias (granularidade base)
Uma linha por **integração × dia × campanha**. Armazena **apenas contadores brutos**:

| Coluna | Tipo | Significado |
|--------|------|-------------|
| `spend` | Decimal(14,2) | Investimento |
| `impressions` | Int | Impressões |
| `reach` | Int | Alcance |
| `clicks` | Int | Cliques |
| `conversions` | Int | Conversões |
| `leads` | Int | Leads |
| `revenue` | Decimal(14,2) | Receita atribuída |

Único por `(integrationId, date, campaignId)`; índice em `(integrationId, date)`.
Os **indicadores derivados** não são persistidos — são calculados em runtime
(`src/lib/metrics.ts`):

```
CPC  = spend / clicks
CPM  = spend / impressions × 1000
CTR  = clicks / impressions × 100
CPL  = spend / leads
CPA  = spend / conversions
Conv = conversions / clicks × 100
ROAS = revenue / spend
Crescimento = (atual − anterior) / |anterior| × 100
```

### `Report` — relatório gerado
`period ∈ {DAILY, WEEKLY, MONTHLY, CUSTOM}`, `startDate`/`endDate`, `status ∈ {DRAFT,
GENERATING, READY, SENT, ERROR}`. **`shareToken`** (único) habilita o link público;
**`dataSnapshot`** (JSON) congela o `ReportData` agregado no momento da geração; `pdfUrl`
opcional; `config` (seções/métricas).

### `AiInsight` — análises de IA do relatório
`type ∈ {EXECUTIVE_SUMMARY, PERFORMANCE_ANALYSIS, GROWTH_EXPLANATION, OPTIMIZATION}`,
`content`, `model`.

### `ReportSchedule` — agendamento automático
`frequency`, `channels[]` (`EMAIL`/`WHATSAPP`/`LINK`), `recipients[]`, `includeAi`,
`isActive`, `lastRunAt`, `nextRunAt`. Índice em `(nextRunAt, isActive)`.

### `ReportDelivery` — log de envios
`channel`, `recipient`, `status ∈ {PENDING, SENT, FAILED}`, `error`, `sentAt`.

### `ActivityLog` — auditoria
`action`, `entity`, `entityId`, `metadata` (JSON), por agência.

## Enums

`Role`, `Plan`, `Platform`, `IntegrationStatus`, `ReportPeriod`, `ReportStatus`,
`ScheduleFrequency`, `DeliveryChannel`, `DeliveryStatus`, `InsightType`.

## Índices e integridade

- `onDelete: Cascade` de `Agency` → tudo da agência; de `Client` → integrações/relatórios.
- `onDelete: SetNull` em `Integration.clientId` e `ActivityLog.userId` para preservar
  histórico.
- Índices compostos para as queries quentes: `MetricDaily(integrationId, date)`,
  `Integration(agencyId, platform)`, `Report(clientId)`, `ReportSchedule(nextRunAt, isActive)`.

## Migrações

```bash
npm run db:push      # prototipagem (sincroniza schema sem migration)
npm run db:migrate   # cria migration versionada (produção)
npm run db:seed      # popula dados de demonstração
npm run db:studio    # explora o banco (Prisma Studio)
```

## Escala das métricas

`Int` para impressões/alcance/cliques cobre folgadamente o volume **diário por conta**. Para
contas muito grandes ou granularidade por anúncio, migrar esses campos para `BigInt` e
considerar particionamento de `MetricDaily` por mês.
