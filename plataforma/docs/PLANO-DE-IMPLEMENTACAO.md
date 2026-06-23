# Plano de implementação — Reportia

Plano em **etapas**, indicando o que já está entregue neste repositório (✅) e o que falta
para produção em escala (⬜). Cada fase é incremental e entregável.

---

## Fase 0 — Fundação ✅ (entregue)
- [x] Projeto Next.js 14 + TypeScript + Tailwind (tema claro/escuro).
- [x] Schema PostgreSQL multi-tenant (Prisma) + seed de demonstração.
- [x] Autenticação NextAuth (JWT) com 3 papéis (ADMIN, MANAGER, CLIENT).
- [x] RBAC + isolamento por agência + middleware de proteção.
- [x] Build de produção verde e fluxo validado de ponta a ponta.

## Fase 1 — Núcleo do produto ✅ (entregue)
- [x] CRUD de clientes (logo, contato, identidade visual).
- [x] Camada de integrações (adaptadores Meta/Google/TikTok/LinkedIn/GA4/Search Console)
      com **modo demo**.
- [x] Motor de métricas (CPC, CPM, CTR, CPL, ROAS, crescimento).
- [x] Dashboard (KPIs comparados, gráficos, ranking de clientes).
- [x] Geração de relatórios com snapshot imutável.
- [x] Análise por IA (resumo executivo, desempenho, crescimento, otimizações) + fallback.
- [x] Exportação em PDF e link público de compartilhamento.
- [x] Envio por e-mail e WhatsApp (demo) + log de entregas.
- [x] Portal do cliente final.
- [x] Agendamentos + endpoints de cron (diário/semanal/mensal).

## Fase 2 — Integrações reais (produção) 🚧 (código entregue)
**Objetivo:** sair do modo demo. O código de produção está implementado conforme as specs
oficiais; falta a **validação ao vivo** (depende de credenciais/aprovações de cada plataforma).
- [x] `fetchInsights` real de todas as plataformas (Meta Graph Insights, Google Ads GAQL
      `searchStream`, GA4 `runReport`, Search Console `searchAnalytics`, TikTok
      `report/integrated/get`, LinkedIn `adAnalytics`) — com fallback demo preservado.
- [x] **Refresh automático de tokens** antes de expirar (`getValidAccessToken`) com persistência
      cifrada (Meta long-lived, Google/LinkedIn refresh_token grant).
- [x] **Seleção de contas após OAuth** (`listAccounts` por adaptador + tela
      `/integracoes/selecionar` + `PATCH /api/integrations/:id`).
- [x] **Retry/backoff** com tratamento de rate limit (`Retry-After`) em `lib/integrations/http.ts`.
- [x] Status da integração atualizado por sincronização (CONNECTED/ERROR/EXPIRED).
- [ ] **Validação ao vivo** por plataforma (requer credenciais reais):
  - [ ] Meta: App Review (`ads_read`) e mapeamento fino de ações → leads/receita por conta.
  - [ ] Google: aprovação do **developer token** + `login-customer-id` p/ MCC.
  - [ ] TikTok / LinkedIn: apps aprovados e versões de API fixadas.
- [ ] Backfill histórico ao conectar (delegado à Fase 3 — fila).

## Fase 3 — Sincronização e jobs em escala ⬜
**Objetivo:** desacoplar a coleta da requisição do usuário.
- [ ] Fila de jobs (BullMQ/Redis ou QStash) para `sync` e `generate`.
- [ ] Sincronização incremental diária (somente dias novos) por integração.
- [ ] *Backfill* histórico (90–180 dias) ao conectar uma conta.
- [ ] Estado de "GENERATING" com atualização em tempo real (polling/websocket).
- [ ] Idempotência e *dead-letter* para falhas.

## Fase 4 — Relatórios avançados ⬜
- [ ] Construtor de relatório (escolher seções/métricas/ordem) — usa `Report.config`.
- [ ] Comparação de períodos personalizada e múltiplos clientes (visão consolidada).
- [ ] Quebra por campanha/conjunto/anúncio com *drill-down*.
- [ ] Metas por cliente (ex.: CPL alvo) com alertas quando estourar.
- [ ] Templates de relatório por nicho (e-commerce, leads, B2B).
- [ ] Upload de logo/arquivos (Vercel Blob/S3) em vez de URL.

## Fase 5 — IA aprofundada ⬜
- [ ] Insights comparativos entre canais e tendências de várias semanas.
- [ ] Detecção de anomalias (queda súbita de ROAS, pico de CPL).
- [ ] Chat sobre o relatório ("por que o CPL subiu?") com *tool use* nas métricas.
- [ ] Geração de *creative briefs* a partir do desempenho.
- [ ] Cache/registro de prompts e custo por agência.

## Fase 6 — Colaboração, billing e escala ⬜
- [ ] Convites de usuários e gestão de equipe (papéis por cliente).
- [ ] Portal do cliente com login por *magic link*.
- [ ] **Billing** (Stripe): planos FREE/STARTER/PRO/AGENCY, limites de clientes/relatórios.
- [ ] White-label avançado: domínio próprio por agência.
- [ ] Observabilidade (Sentry, logs estruturados) e métricas de produto.
- [ ] LGPD: consentimento, exportação e exclusão de dados.

## Fase 7 — Qualidade e operação ⬜
- [ ] Testes unitários (`metrics`, `build`) e e2e (Playwright) dos fluxos críticos.
- [ ] Migrations versionadas (`prisma migrate`) e CI/CD.
- [ ] Particionamento de `MetricDaily` por mês; índices revisados sob carga.
- [ ] Rate limiting das rotas públicas (`/r/:token`) e auditoria via `ActivityLog`.

---

## Sugestão de cronograma (equipe enxuta)

| Sprint | Foco | Saída |
|--------|------|-------|
| 1 | Deploy Fase 0–1 + Meta Ads real | Primeiro cliente real com Meta |
| 2 | Google (Ads/GA4/SC) + refresh de tokens | Multicanal Google |
| 3 | Fila + sync incremental + backfill | Coleta robusta em escala |
| 4 | Construtor de relatório + metas/alertas | Diferenciais de produto |
| 5 | TikTok/LinkedIn + IA avançada | Cobertura total de canais |
| 6 | Billing + white-label + observabilidade | Pronto para vender |

## Riscos e mitigação
- **Aprovações de API (Meta/Google):** começar o processo cedo; modo demo permite vender/
  validar enquanto aprova.
- **Custos de IA:** usar modelo mais barato para resumos curtos e *caching*; IA é opcional.
- **Limites serverless (PDF/sync):** mover tarefas longas para fila/worker (Fase 3).
- **Qualidade dos dados:** normalização por adaptador + testes do motor de métricas.
