import { Sparkles, TrendingUp, Lightbulb } from 'lucide-react'
import type { ReportData } from '@/lib/types'
import type { ReportInsights } from '@/lib/ai/analyze'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { MetricChart } from '@/components/dashboard/metric-chart'
import { PlatformDonut } from '@/components/dashboard/platform-donut'
import { METRIC_LABELS, isFavorable, type MetricKey } from '@/lib/metrics'
import { formatCurrency, formatNumber } from '@/lib/utils'

const KPI_ROWS: { key: MetricKey; fmt: (v: number) => string }[] = [
  { key: 'spend', fmt: formatCurrency },
  { key: 'leads', fmt: formatNumber },
  { key: 'cpl', fmt: formatCurrency },
  { key: 'roas', fmt: (v) => v.toFixed(2) },
  { key: 'impressions', fmt: formatNumber },
  { key: 'clicks', fmt: formatNumber },
  { key: 'ctr', fmt: (v) => `${v.toFixed(2)}%` },
  { key: 'conversions', fmt: formatNumber },
  { key: 'cpc', fmt: formatCurrency },
  { key: 'revenue', fmt: formatCurrency },
  { key: 'cpm', fmt: formatCurrency },
  { key: 'reach', fmt: formatNumber },
]

export function ReportView({ data, insights }: { data: ReportData; insights?: ReportInsights }) {
  const { current, deltas } = data.comparison

  return (
    <div className="space-y-6">
      {/* Cabeçalho com branding */}
      <div
        className="rounded-xl p-6 text-white"
        style={{ background: `linear-gradient(135deg, ${data.branding.primary}, ${data.branding.secondary})` }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">{data.branding.agencyName}</p>
            <h2 className="text-2xl font-bold">{data.client.name}</h2>
            <p className="mt-1 text-sm opacity-90">{data.period.label}</p>
          </div>
          {data.branding.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.branding.logoUrl} alt={data.client.name} className="h-12 w-auto rounded bg-white/10 p-1" />
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {KPI_ROWS.map(({ key, fmt }) => (
          <KpiCard
            key={key}
            label={METRIC_LABELS[key]}
            value={fmt(current[key])}
            delta={deltas[key]}
            favorable={isFavorable(key, deltas[key])}
          />
        ))}
      </div>

      {/* Resumo executivo (IA) */}
      {insights && (
        <Card className="border-primary/30">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Resumo executivo</CardTitle>
            <Badge variant="default" className="ml-2">IA</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p className="text-base font-medium text-foreground">{insights.executiveSummary}</p>
            <p>{insights.performanceAnalysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução do investimento</CardTitle>
          </CardHeader>
          <CardContent>
            <MetricChart data={data.series} metric="spend" color={data.branding.primary} currency />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Investimento por plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <PlatformDonut platforms={data.platforms} />
            <div className="mt-4 space-y-2">
              {data.platforms.map((p) => (
                <div key={p.platform} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{p.label}</span>
                  <span className="font-medium">{p.share.toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela por plataforma */}
      <Card>
        <CardHeader>
          <CardTitle>Desempenho por plataforma</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-6 py-3 font-medium">Plataforma</th>
                  <th className="px-6 py-3 font-medium">Investimento</th>
                  <th className="px-6 py-3 font-medium">Leads</th>
                  <th className="px-6 py-3 font-medium">CPL</th>
                  <th className="px-6 py-3 font-medium">CTR</th>
                  <th className="px-6 py-3 font-medium">ROAS</th>
                </tr>
              </thead>
              <tbody>
                {data.platforms.map((p) => (
                  <tr key={p.platform} className="border-b border-border/50 last:border-0">
                    <td className="px-6 py-3 font-medium">{p.label}</td>
                    <td className="px-6 py-3">{formatCurrency(p.metrics.spend)}</td>
                    <td className="px-6 py-3">{formatNumber(p.metrics.leads)}</td>
                    <td className="px-6 py-3">{formatCurrency(p.metrics.cpl)}</td>
                    <td className="px-6 py-3">{p.metrics.ctr.toFixed(2)}%</td>
                    <td className="px-6 py-3 font-medium">{p.metrics.roas.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Análise de crescimento + otimizações (IA) */}
      {insights && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <CardTitle>Análise de crescimento</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {insights.growthExplanation}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-2 space-y-0">
              <Lightbulb className="h-5 w-5 text-warning" />
              <CardTitle>Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {insights.optimizations.map((o, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {o}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

/** Reconstrói o objeto de insights a partir dos registros do banco. */
export function insightsFromRecords(records: { type: string; content: string }[]): ReportInsights | undefined {
  if (!records || records.length === 0) return undefined
  const get = (t: string) => records.find((r) => r.type === t)?.content ?? ''
  return {
    executiveSummary: get('EXECUTIVE_SUMMARY'),
    performanceAnalysis: get('PERFORMANCE_ANALYSIS'),
    growthExplanation: get('GROWTH_EXPLANATION'),
    optimizations: get('OPTIMIZATION').split('\n').filter(Boolean),
  }
}
