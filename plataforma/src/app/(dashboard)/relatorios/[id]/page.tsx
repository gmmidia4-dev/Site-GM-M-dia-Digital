import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { buildReportData } from '@/lib/reports/build'
import { ReportView, insightsFromRecords } from '@/components/report/report-view'
import { ReportActions } from '@/components/report/report-actions'
import { PageHeader } from '@/components/dashboard/page-header'
import type { ReportData } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const report = await prisma.report.findUnique({
    where: { id: params.id },
    include: { insights: true, client: true },
  })
  if (!report) notFound()
  if (report.agencyId !== session!.user.agencyId) redirect('/relatorios')

  const data: ReportData =
    (report.dataSnapshot as unknown as ReportData) ??
    (await buildReportData(report.clientId, report.startDate, report.endDate))
  const insights = insightsFromRecords(report.insights)

  return (
    <>
      <PageHeader
        title={report.title}
        description={report.client.name}
        action={
          <ReportActions
            reportId={report.id}
            shareToken={report.shareToken}
            defaultEmail={report.client.contactEmail}
            defaultPhone={report.client.contactPhone}
          />
        }
      />
      <ReportView data={data} insights={insights} />
    </>
  )
}
