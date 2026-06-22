# APIs — Reportia

Dois grupos: **(A)** a API interna (Route Handlers) consumida pelo front-end e pelos crons; e
**(B)** as APIs externas que precisam ser provisionadas para sair do modo demo.

---

## A) API interna (REST)

Base: `/api`. Autenticação por sessão (NextAuth/JWT em cookie). Erros padronizados:
`{ "error": string, "details"?: object }` com status apropriado (`401/403/400/404/500`).

### Autenticação e conta
| Método | Rota | Papel | Descrição |
|--------|------|-------|-----------|
| `POST` | `/api/register` | público | Cria agência + usuário ADMIN |
| `*` | `/api/auth/[...nextauth]` | público | Login/logout/sessão (NextAuth) |
| `GET` | `/api/agency` | staff | Dados da agência |
| `PATCH` | `/api/agency` | ADMIN | Atualiza white-label (nome, logo, cores) |

### Clientes
| Método | Rota | Papel | Descrição |
|--------|------|-------|-----------|
| `GET` | `/api/clients` | qualquer* | Lista clientes acessíveis |
| `POST` | `/api/clients` | staff | Cadastra cliente |
| `GET` | `/api/clients/:id` | acesso ao cliente | Detalhe (+ integrações, relatórios) |
| `PATCH` | `/api/clients/:id` | staff | Atualiza cliente |
| `DELETE` | `/api/clients/:id` | staff | Remove cliente |

### Integrações
| Método | Rota | Papel | Descrição |
|--------|------|-------|-----------|
| `GET` | `/api/integrations` | staff | Lista contas conectadas (sem tokens) |
| `POST` | `/api/integrations` | staff | Conecta/atualiza conta (ID direto / demo) |
| `DELETE` | `/api/integrations/:id` | staff | Desconecta conta |
| `GET` | `/api/oauth/:platform/authorize` | staff | Inicia OAuth (redirect p/ consentimento) |
| `GET` | `/api/oauth/:platform/callback` | staff | Troca code por tokens (cifra e salva) |

`:platform ∈ { meta, google, tiktok, linkedin, ga4, searchconsole }`

### Relatórios
| Método | Rota | Papel | Descrição |
|--------|------|-------|-----------|
| `GET` | `/api/reports` | qualquer* | Lista (filtro `?clientId=`) |
| `POST` | `/api/reports` | staff | Cria **e gera** (sync + agrega + IA + snapshot) |
| `GET` | `/api/reports/:id` | acesso ao cliente | Relatório + insights |
| `DELETE` | `/api/reports/:id` | staff | Remove |
| `POST` | `/api/reports/:id/generate` | staff | Regenera |
| `POST` | `/api/reports/:id/send` | staff | Envia (`channels`, `recipients`) |
| `GET` | `/api/reports/:id/pdf` | acesso ao cliente | PDF (stream) |

### Automação (Vercel Cron)
| Método | Rota | Proteção | Descrição |
|--------|------|----------|-----------|
| `GET` | `/api/cron/daily` | `Bearer CRON_SECRET` | Processa agendamentos diários |
| `GET` | `/api/cron/weekly` | idem | Semanais (segunda) |
| `GET` | `/api/cron/monthly` | idem | Mensais (dia 1º) |

\* "qualquer" = ADMIN/MANAGER veem tudo da agência; CLIENT vê apenas clientes vinculados.

#### Exemplo — gerar relatório
```bash
curl -X POST /api/reports -H 'Content-Type: application/json' -d '{
  "clientId": "ckxyz...",
  "title": "Relatório mensal — Junho/2026",
  "period": "MONTHLY",
  "startDate": "2026-06-01",
  "endDate": "2026-06-30",
  "includeAi": true
}'
```

---

## B) APIs externas necessárias

Todas têm um **adaptador** em `src/lib/integrations/`. Em `DEMO_MODE=true` não são chamadas.

### Meta Ads (Facebook/Instagram) — Marketing API
- **Para quê:** investimento, impressões, alcance, cliques, ações (leads/compras), receita.
- **Credenciais:** `META_APP_ID`, `META_APP_SECRET` (App no Meta for Developers, produto
  *Marketing API*). Escopos: `ads_read`, `business_management`.
- **Endpoint:** `GET /{act_id}/insights` (`level=campaign`, `time_increment=1`).
- **Aprovação:** App Review para uso além das contas de teste.

### Google Ads — Google Ads API
- **Para quê:** custo (`cost_micros`), impressões, cliques, conversões e valor.
- **Credenciais:** `GOOGLE_CLIENT_ID/SECRET` (OAuth) + **developer token**
  (`GOOGLE_ADS_DEVELOPER_TOKEN`) e, p/ MCC, `GOOGLE_ADS_LOGIN_CUSTOMER_ID`.
- **Endpoint:** `customers/{id}/googleAds:searchStream` (GAQL). Escopo `.../auth/adwords`.
- **Aprovação:** developer token requer aprovação (basic/standard access).

### TikTok Ads — Marketing API
- **Para quê:** spend, impressões, alcance, cliques, conversões/pagamentos.
- **Credenciais:** `TIKTOK_APP_ID`, `TIKTOK_APP_SECRET` (TikTok for Business).
- **Endpoint:** `/open_api/v1.3/report/integrated/get/` (`data_level=AUCTION_CAMPAIGN`).

### LinkedIn Ads — Marketing/Reporting API
- **Para quê:** custo, impressões, cliques, conversões externas (B2B).
- **Credenciais:** `LINKEDIN_CLIENT_ID/SECRET`. Escopos `r_ads`, `r_ads_reporting`.
- **Endpoint:** `/rest/adAnalytics` (`pivot=CAMPAIGN`, `timeGranularity=DAILY`).

### Google Analytics 4 — Data API
- **Para quê:** sessões, conversões e receita por origem/campanha (complementa mídia paga).
- **Endpoint:** `properties/{id}:runReport`. Escopo `.../auth/analytics.readonly`.

### Google Search Console — Search Analytics API
- **Para quê:** cliques/impressões/CTR orgânicos.
- **Endpoint:** `sites/{site}/searchAnalytics/query`. Escopo `.../auth/webmasters.readonly`.

> Google Ads, GA4 e Search Console compartilham o **mesmo OAuth Google** (um único
> consentimento cobre os três escopos).

### Serviços de apoio
| Serviço | Variáveis | Uso |
|---------|-----------|-----|
| **Anthropic Claude** | `ANTHROPIC_API_KEY`, `AI_MODEL` | Análises de IA (fallback determinístico se ausente) |
| **Resend** | `RESEND_API_KEY`, `EMAIL_FROM` | Envio de e-mail (modo demo só loga) |
| **WhatsApp Cloud API** | `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_TEMPLATE_NAME` | Envio por WhatsApp |

### Como ativar a produção
1. Defina `DEMO_MODE=false`.
2. Configure as credenciais da(s) plataforma(s) desejada(s) no `.env`.
3. Conecte cada conta via **OAuth** (`/api/oauth/:platform/authorize?clientId=…`) — os tokens
   são cifrados (AES-256-GCM) e salvos por integração.
4. A sincronização passa a usar dados reais automaticamente.
