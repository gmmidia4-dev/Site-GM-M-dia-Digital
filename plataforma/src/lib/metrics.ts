/**
 * Motor de métricas de tráfego pago.
 *
 * Trabalha sobre contadores brutos (investimento, impressões, alcance, cliques,
 * conversões, leads, receita) e deriva os indicadores: CPC, CPM, CTR, CPL,
 * taxa de conversão e ROAS. Também calcula a variação (crescimento) entre dois
 * períodos.
 */

export interface RawMetrics {
  spend: number
  impressions: number
  reach: number
  clicks: number
  conversions: number
  leads: number
  revenue: number
}

export interface DerivedMetrics extends RawMetrics {
  cpc: number // Custo por clique
  cpm: number // Custo por mil impressões
  ctr: number // Taxa de cliques (%)
  cpl: number // Custo por lead
  cpa: number // Custo por aquisição/conversão
  convRate: number // Taxa de conversão (%)
  roas: number // Retorno sobre investimento em anúncios
}

export const EMPTY_RAW: RawMetrics = {
  spend: 0,
  impressions: 0,
  reach: 0,
  clicks: 0,
  conversions: 0,
  leads: 0,
  revenue: 0,
}

function div(a: number, b: number): number {
  return b > 0 ? a / b : 0
}

/** Soma uma coleção de linhas de métrica em um único total bruto. */
export function sumRaw(rows: Partial<RawMetrics>[]): RawMetrics {
  return rows.reduce<RawMetrics>(
    (acc, r) => ({
      spend: acc.spend + Number(r.spend ?? 0),
      impressions: acc.impressions + Number(r.impressions ?? 0),
      reach: acc.reach + Number(r.reach ?? 0),
      clicks: acc.clicks + Number(r.clicks ?? 0),
      conversions: acc.conversions + Number(r.conversions ?? 0),
      leads: acc.leads + Number(r.leads ?? 0),
      revenue: acc.revenue + Number(r.revenue ?? 0),
    }),
    { ...EMPTY_RAW }
  )
}

/** Deriva os indicadores a partir dos contadores brutos. */
export function derive(raw: RawMetrics): DerivedMetrics {
  return {
    ...raw,
    cpc: div(raw.spend, raw.clicks),
    cpm: div(raw.spend, raw.impressions) * 1000,
    ctr: div(raw.clicks, raw.impressions) * 100,
    cpl: div(raw.spend, raw.leads),
    cpa: div(raw.spend, raw.conversions),
    convRate: div(raw.conversions, raw.clicks) * 100,
    roas: div(raw.revenue, raw.spend),
  }
}

export function aggregate(rows: Partial<RawMetrics>[]): DerivedMetrics {
  return derive(sumRaw(rows))
}

/**
 * Variação percentual entre período atual e anterior.
 * Retorna null quando não há base de comparação (anterior = 0).
 */
export function growth(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return ((current - previous) / Math.abs(previous)) * 100
}

export type MetricKey = keyof DerivedMetrics

/**
 * Indica se um aumento da métrica é positivo (verde) ou negativo (vermelho).
 * Ex.: subir ROAS é bom; subir CPL é ruim.
 */
export const METRIC_DIRECTION: Record<MetricKey, 'up' | 'down'> = {
  spend: 'up', // neutro/contextual, tratado como informativo
  impressions: 'up',
  reach: 'up',
  clicks: 'up',
  conversions: 'up',
  leads: 'up',
  revenue: 'up',
  ctr: 'up',
  convRate: 'up',
  roas: 'up',
  cpc: 'down',
  cpm: 'down',
  cpl: 'down',
  cpa: 'down',
}

/** Avalia se a variação foi favorável, considerando a direção da métrica. */
export function isFavorable(metric: MetricKey, delta: number | null): boolean | null {
  if (delta === null || delta === 0) return null
  const wantsUp = METRIC_DIRECTION[metric] === 'up'
  return wantsUp ? delta > 0 : delta < 0
}

export interface MetricComparison {
  current: DerivedMetrics
  previous: DerivedMetrics
  deltas: Record<MetricKey, number | null>
}

/** Compara dois conjuntos de métricas brutas e devolve atual, anterior e deltas. */
export function compare(currentRows: Partial<RawMetrics>[], previousRows: Partial<RawMetrics>[]): MetricComparison {
  const current = aggregate(currentRows)
  const previous = aggregate(previousRows)
  const keys = Object.keys(current) as MetricKey[]
  const deltas = keys.reduce(
    (acc, k) => {
      acc[k] = growth(current[k], previous[k])
      return acc
    },
    {} as Record<MetricKey, number | null>
  )
  return { current, previous, deltas }
}

/** Rótulos legíveis (pt-BR) para cada métrica. */
export const METRIC_LABELS: Record<MetricKey, string> = {
  spend: 'Investimento',
  impressions: 'Impressões',
  reach: 'Alcance',
  clicks: 'Cliques',
  conversions: 'Conversões',
  leads: 'Leads',
  revenue: 'Receita',
  cpc: 'CPC',
  cpm: 'CPM',
  ctr: 'CTR',
  cpl: 'CPL',
  cpa: 'CPA',
  convRate: 'Taxa de conversão',
  roas: 'ROAS',
}
