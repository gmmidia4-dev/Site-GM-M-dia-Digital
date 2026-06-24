import Anthropic from '@anthropic-ai/sdk'
import type { ReportData } from '@/lib/types'
import { METRIC_LABELS, type MetricKey } from '@/lib/metrics'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils'

export interface ReportInsights {
  executiveSummary: string
  performanceAnalysis: string
  growthExplanation: string
  optimizations: string[]
}

const MODEL = process.env.AI_MODEL || 'claude-opus-4-8'

/**
 * Gera as análises de IA a partir dos dados do relatório.
 * Sem ANTHROPIC_API_KEY, cai para um gerador determinístico (sem custo),
 * o que mantém o produto funcional em modo demonstração.
 */
export async function analyzeReport(data: ReportData): Promise<ReportInsights> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return ruleBasedInsights(data)
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const prompt = buildPrompt(data)

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1800,
      system:
        'Você é um analista sênior de tráfego pago de uma agência de marketing. ' +
        'Escreve em português do Brasil, de forma clara e objetiva, para o cliente final. ' +
        'Baseie-se SOMENTE nos números fornecidos, sem inventar dados. ' +
        'Responda EXCLUSIVAMENTE com um objeto JSON válido no formato pedido.',
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('')

    return parseInsights(text, data)
  } catch (err) {
    console.error('Falha na análise de IA, usando fallback:', err)
    return ruleBasedInsights(data)
  }
}

function buildPrompt(data: ReportData): string {
  const { current, previous, deltas } = data.comparison
  const lines = (Object.keys(METRIC_LABELS) as MetricKey[]).map((k) => {
    const d = deltas[k]
    const variation = d === null ? 'sem base' : `${d > 0 ? '+' : ''}${d.toFixed(1)}%`
    return `- ${METRIC_LABELS[k]}: ${formatMetric(k, current[k])} (anterior ${formatMetric(k, previous[k])}, variação ${variation})`
  })

  const platforms = data.platforms
    .map((p) => `- ${p.label}: ${formatCurrency(p.metrics.spend)} (${p.share.toFixed(0)}% do investimento), ${formatNumber(p.metrics.leads)} leads, ROAS ${p.metrics.roas.toFixed(2)}`)
    .join('\n')

  return `Cliente: ${data.client.name}
Período: ${data.period.label}

Métricas (período atual vs. anterior):
${lines.join('\n')}

Distribuição por plataforma:
${platforms}

Gere um JSON com exatamente estas chaves:
{
  "executiveSummary": "2 a 3 frases para um C-level, destacando o resultado principal do período.",
  "performanceAnalysis": "1 parágrafo analisando os números (volume, eficiência e retorno).",
  "growthExplanation": "1 parágrafo explicando os principais movimentos de crescimento ou queda e prováveis causas.",
  "optimizations": ["3 a 5 recomendações práticas e específicas para o próximo período"]
}`
}

function formatMetric(key: MetricKey, value: number): string {
  if (['spend', 'revenue', 'cpc', 'cpm', 'cpl', 'cpa'].includes(key)) return formatCurrency(value)
  if (['ctr', 'convRate'].includes(key)) return formatPercent(value)
  if (key === 'roas') return value.toFixed(2)
  return formatNumber(value)
}

function parseInsights(text: string, data: ReportData): ReportInsights {
  try {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    const json = JSON.parse(text.slice(start, end + 1))
    return {
      executiveSummary: String(json.executiveSummary ?? ''),
      performanceAnalysis: String(json.performanceAnalysis ?? ''),
      growthExplanation: String(json.growthExplanation ?? ''),
      optimizations: Array.isArray(json.optimizations) ? json.optimizations.map(String) : [],
    }
  } catch {
    return ruleBasedInsights(data)
  }
}

/** Fallback determinístico baseado em regras (sem chamada externa). */
export function ruleBasedInsights(data: ReportData): ReportInsights {
  const { current, deltas } = data.comparison
  const spendDelta = deltas.spend
  const leadsDelta = deltas.leads
  const roasDelta = deltas.roas
  const cplDelta = deltas.cpl

  const dir = (v: number | null) => (v === null ? 'estável' : v > 0 ? 'alta' : 'queda')
  const pct = (v: number | null) => (v === null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(1)}%`)

  const executiveSummary =
    `No período de ${data.period.label}, ${data.client.name} investiu ${formatCurrency(current.spend)} ` +
    `e gerou ${formatNumber(current.leads)} leads (${pct(leadsDelta)} vs. período anterior), ` +
    `com CPL de ${formatCurrency(current.cpl)} e ROAS de ${current.roas.toFixed(2)}.`

  const performanceAnalysis =
    `Foram ${formatNumber(current.impressions)} impressões e ${formatNumber(current.clicks)} cliques ` +
    `(CTR de ${formatPercent(current.ctr)}). A campanha converteu ${formatNumber(current.conversions)} vezes ` +
    `(taxa de ${formatPercent(current.convRate)}), com CPC médio de ${formatCurrency(current.cpc)} e ` +
    `CPM de ${formatCurrency(current.cpm)}. A receita atribuída foi de ${formatCurrency(current.revenue)}.`

  const growthExplanation =
    `O investimento teve ${dir(spendDelta)} (${pct(spendDelta)}) e a geração de leads ${dir(leadsDelta)} (${pct(leadsDelta)}). ` +
    `O CPL apresentou ${dir(cplDelta)} (${pct(cplDelta)}) e o ROAS ${dir(roasDelta)} (${pct(roasDelta)}), ` +
    `indicando ${roasDelta !== null && roasDelta >= 0 ? 'ganho' : 'pressão'} de eficiência no retorno.`

  const top = data.platforms[0]
  const optimizations: string[] = []
  if (cplDelta !== null && cplDelta > 10) optimizations.push('Revisar segmentações e criativos das campanhas com CPL em alta para reduzir o custo por lead.')
  if (current.ctr < 1) optimizations.push('Testar novos criativos e ganchos, pois o CTR está abaixo de 1%.')
  if (top) optimizations.push(`Realocar parte do orçamento para ${top.label}, que concentra ${top.share.toFixed(0)}% do investimento e melhor ROAS.`)
  optimizations.push('Escalar gradualmente (20%/semana) os conjuntos de anúncios com ROAS acima da média.')
  optimizations.push('Implementar testes A/B de página de destino para elevar a taxa de conversão.')

  return { executiveSummary, performanceAnalysis, growthExplanation, optimizations: optimizations.slice(0, 5) }
}
