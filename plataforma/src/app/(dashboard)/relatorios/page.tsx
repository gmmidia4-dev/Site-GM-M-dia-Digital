import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDateShort } from '@/lib/utils'
import type { ReportStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

const STATUS: Record<ReportStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'secondary' | 'destructive' }> = {
  DRAFT: { label: 'Rascunho', variant: 'secondary' },
  GENERATING: { label: 'Gerando…', variant: 'warning' },
  READY: { label: 'Pronto', variant: 'default' },
  SENT: { label: 'Enviado', variant: 'success' },
  ERROR: { label: 'Erro', variant: 'destructive' },
}

const PERIOD_LABEL = { DAILY: 'Diário', WEEKLY: 'Semanal', MONTHLY: 'Mensal', CUSTOM: 'Personalizado' }

export default async function ReportsPage() {
  const session = await auth()
  const reports = await prisma.report.findMany({
    where: { agencyId: session!.user.agencyId },
    include: { client: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Gere, compartilhe e envie relatórios para seus clientes."
        action={
          <Button asChild>
            <Link href="/relatorios/novo">
              <Plus className="h-4 w-4" /> Novo relatório
            </Link>
          </Button>
        }
      />

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 font-medium">Nenhum relatório ainda</p>
            <p className="mt-1 text-sm text-muted-foreground">Crie o primeiro relatório de um cliente.</p>
            <Button asChild className="mt-4">
              <Link href="/relatorios/novo">
                <Plus className="h-4 w-4" /> Novo relatório
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-6 py-3 font-medium">Relatório</th>
                    <th className="px-6 py-3 font-medium">Cliente</th>
                    <th className="px-6 py-3 font-medium">Período</th>
                    <th className="px-6 py-3 font-medium">Criado</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 last:border-0 hover:bg-muted/40">
                      <td className="px-6 py-3">
                        <Link href={`/relatorios/${r.id}`} className="font-medium hover:text-primary">
                          {r.title}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{r.client.name}</td>
                      <td className="px-6 py-3 text-muted-foreground">{PERIOD_LABEL[r.period]}</td>
                      <td className="px-6 py-3 text-muted-foreground">{formatDateShort(r.createdAt)}</td>
                      <td className="px-6 py-3">
                        <Badge variant={STATUS[r.status].variant}>{STATUS[r.status].label}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
