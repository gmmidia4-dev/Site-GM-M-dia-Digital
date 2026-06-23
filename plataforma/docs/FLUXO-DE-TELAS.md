# Fluxo das telas — Reportia

## Mapa de navegação

```
PÚBLICO
  /login                      Entrar
  /registrar                  Criar agência (onboarding do ADMIN)
  /r/:token                   Relatório público (somente leitura, branding da agência)

AGÊNCIA (ADMIN / MANAGER)  — layout com sidebar
  /dashboard                  Visão geral (KPIs, gráficos, ranking de clientes)
  /clientes                   Lista de clientes (cards com nº de contas/relatórios)
  /clientes/novo              Cadastro de cliente (logo, contato, cor da marca)
  /clientes/:id               Detalhe (contas conectadas + relatórios recentes)
  /clientes/:id/editar        Edição do cliente
  /integracoes                Conectar contas (form + OAuth) e gerenciar conexões
  /integracoes/selecionar     Escolha da conta de anúncios após o OAuth
  /relatorios                 Lista de relatórios (status)
  /relatorios/novo            Gerar relatório (cliente + período + IA)
  /relatorios/:id             Relatório completo + ações (PDF, link, e-mail, WhatsApp)
  /agendamentos               Envio automático (frequência, canais, destinatários)
  /configuracoes              Identidade visual da agência (white-label) — somente ADMIN
  /configuracoes/equipe       Equipe e permissões (ADMIN/MANAGER/CLIENT) — somente ADMIN

CLIENTE FINAL (CLIENT)  — layout simplificado
  /portal                     Lista dos próprios relatórios → abre /r/:token
```

## Jornadas principais

### A) Onboarding da agência
`/registrar` → cria `Agency` + `User(ADMIN)` → login automático → `/dashboard`.

### B) Cadastrar cliente e conectar contas
`/clientes/novo` → salva cliente → `/clientes/:id` → “Conectar conta” → `/integracoes?clientId=…`
→ escolhe plataforma e conecta (OAuth em produção; ID direto em demo).

### C) Gerar e enviar um relatório
`/relatorios/novo` → seleciona cliente + período (presets 7/30/90 dias) + IA →
`POST /api/reports` (sincroniza, agrega, IA, snapshot) → `/relatorios/:id` →
ações: **Copiar link**, **PDF**, **E-mail**, **WhatsApp**, **Atualizar**.

### D) Cliente final acompanha resultados
Login `CLIENT` → `/portal` → clica no relatório → `/r/:token` (mesmo render do staff, sem
acesso às áreas administrativas).

## Telas em detalhe

### Dashboard (`/dashboard`)
- 6 **KPI cards**: Investimento, Leads, CPL, ROAS, Cliques, CTR — cada um com a variação
  vs. período anterior (verde/vermelho conforme a métrica).
- Gráficos de **investimento diário** e **leads por dia** (Recharts, responsivos ao tema).
- Tabela **ranking de clientes** (investimento, leads, CPL, ROAS).

### Relatório (`/relatorios/:id` e `/r/:token`)
- Cabeçalho **branded** (gradiente com as cores da agência/cliente + logo).
- Grade de **12 métricas** com variação.
- **Resumo executivo (IA)** + análise de desempenho.
- Gráfico de evolução + **donut por plataforma**.
- Tabela de **desempenho por plataforma**.
- **Análise de crescimento** + **recomendações** (IA).

### Integrações (`/integracoes`)
- Formulário de conexão (cliente, plataforma, ID/apelido).
- Lista de contas com status e última sincronização; botão desconectar.

## Design system

- **Tema claro/escuro** via `next-themes` (toggle no topo) — variáveis CSS HSL em
  `globals.css`.
- Componentes em `src/components/ui` (Button, Card, Input, Label, Badge, Select, Textarea).
- **Responsivo**: sidebar vira *drawer* no mobile; grids colapsam para 1–2 colunas.
- Paleta: primária indigo `#6366F1`, secundária emerald `#10B981` (personalizável por agência).

## Wireframe textual (relatório)

```
┌───────────────────────────────────────────── [logo] ┐
│  AGÊNCIA DEMO                                          │  ← gradiente branded
│  Loja Vitória E-commerce                               │
│  01 de maio — 31 de maio de 2026                       │
├───────────────────────────────────────────────────────┤
│ [Investimento] [Leads] [CPL] [ROAS] … (12 KPIs)        │
├───────────────────────────────────────────────────────┤
│ ✨ Resumo executivo (IA)                               │
├──────────────────────────────┬────────────────────────┤
│ Evolução do investimento      │  Investimento/plataforma│
│ (área)                        │  (donut + %)            │
├───────────────────────────────────────────────────────┤
│ Tabela: plataforma | invest. | leads | CPL | CTR | ROAS│
├──────────────────────────────┬────────────────────────┤
│ 📈 Análise de crescimento     │ 💡 Recomendações        │
└───────────────────────────────────────────────────────┘
```
