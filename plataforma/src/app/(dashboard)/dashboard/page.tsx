import Link from 'next/link'
import { DollarSign, Users2, Target, TrendingUp, MousePointerClick, Percent } from 'lucide-react'
import { auth } from '@/lib/auth'
import { buildAgencyOverview } from '@/lib/reports/overview'
import { PageHeader } from '@/components/dashboard/page-header'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { MetricChart } from '@/components/dashboard/metric-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatNumber, initials } from '@/lib/utils'
import { isFavorable } from '@/lib/metrics'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await auth()
  const { comparison, series, clients, clientCount } = await buildAgencyOverview(session!.user.agencyId, 30)
  const { current, deltas } = comparison

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão geral dos últimos 30 dias, comparada ao período anterior."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KpiCard
          label="Investimento total"
          value={formatCurrency(current.spend)}
          delta={deltas.spend}
          favorable={null}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <KpiCard
          label="Leads gerados"
          value={formatNumber(current.leads)}
          delta={deltas.leads}
          favorable={isFavorable('leads', deltas.leads)}
          icon={<Users2 className="h-4 w-4" />}
        />
        <KpiCard
          label="Custo por lead"
          value={formatCurrency(current.cpl)}
          delta={deltas.cpl}
          favorable={isFavorable('cpl', deltas.cpl)}
          icon={<Target className="h-4 w-4" />}
        />
        <KpiCard
          label="ROAS"
          value={current.roas.toFixed(2)}
          delta={deltas.roas}
          favorable={isFavorable('roas', deltas.roas)}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <KpiCard
          label="Cliques"
          value={formatNumber(current.clicks)}
          delta={deltas.clicks}
          favorable={isFavorable('clicks', deltas.clicks)}
          icon={<MousePointerClick className="h-4 w-4" />}
        />
        <KpiCard
          label="CTR"
          value={`${current.ctr.toFixed(2)}%`}
          delta={deltas.ctr}
          favorable={isFavorable('ctr', deltas.ctr)}
          icon={<Percent className="h-4 w-4" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Investimento diário</CardTitle>
          </CardHeader>
          <CardContent>
            {series.length > 0 ? (
              <MetricChart data={series as any} metric="spend" currency />
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leads por dia</CardTitle>
          </CardHeader>
          <CardContent>
            {series.length > 0 ? (
              <MetricChart data={series as any} metric="leads" color="#10B981" />
            ) : (
              <EmptyChart />
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Clientes ({clientCount})</CardTitle>
          <Link href="/clientes" className="text-sm text-primary hover:underline">
            Ver todos
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {clients.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">
              Nenhum cliente ainda.{' '}
              <Link href="/clientes/novo" className="text-primary hover:underline">
                Cadastre o primeiro
              </Link>
              .
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Cliente</th>
                    <th className="px-6 py-3 font-medium">Investimento</th>
                    <th className="px-6 py-3 font-medium">Leads</th>
                    <th className="px-6 py-3 font-medium">CPL</th>
                    <th className="px-6 py-3 font-medium">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <Link href={`/clientes/${c.id}`} className="flex items-center gap-3 font-medium hover:text-primary">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-bold">
                            {initials(c.name)}
                          </span>
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-6 py-3">{formatCurrency(c.spend)}</td>
                      <td className="px-6 py-3">{formatNumber(c.leads)}</td>
                      <td className="px-6 py-3">{formatCurrency(c.cpl)}</td>
                      <td className="px-6 py-3 font-medium">{c.roas.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function EmptyChart() {
  return (
    <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
      Sem dados no período. Conecte integrações e gere um relatório.
    </div>
  )
}
