import { notFound } from 'next/navigation'
import { Download } from 'lucide-react'
import { prisma } from '@/lib/db'
import { buildReportData } from '@/lib/reports/build'
import { ReportView, insightsFromRecords } from '@/components/report/report-view'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import type { ReportData } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** Página pública (somente leitura) de um relatório compartilhado por link. */
export default async function PublicReportPage({ params }: { params: { token: string } }) {
  const report = await prisma.report.findUnique({
    where: { shareToken: params.token },
    include: { insights: true },
  })
  if (!report) notFound()

  const data: ReportData =
    (report.dataSnapshot as unknown as ReportData) ??
    (await buildReportData(report.clientId, report.startDate, report.endDate))
  const insights = insightsFromRecords(report.insights)

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-8">
        <p className="text-sm font-semibold">{data.branding.agencyName}</p>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={`/api/reports/${report.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" /> PDF
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 lg:p-8">
        <ReportView data={data} insights={insights} />
        <p className="mt-8 text-center text-xs text-muted-foreground">
          Relatório gerado por {data.branding.agencyName} · Powered by Reportia
        </p>
      </main>
    </div>
  )
}
