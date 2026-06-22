import Link from 'next/link'
import { FileText } from 'lucide-react'
import { requireUser, accessibleClientIds } from '@/lib/rbac'
import { prisma } from '@/lib/db'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDateShort } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PortalPage() {
  const user = await requireUser()
  const ids = await accessibleClientIds(user)
  const reports = await prisma.report.findMany({
    where: { clientId: { in: ids }, status: { in: ['READY', 'SENT'] }, shareToken: { not: null } },
    include: { client: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Seus relatórios</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acompanhe os resultados das suas campanhas.</p>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 font-medium">Nenhum relatório disponível</p>
            <p className="mt-1 text-sm text-muted-foreground">Assim que sua agência publicar um relatório, ele aparecerá aqui.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {reports.map((r) => (
            <Link key={r.id} href={`/r/${r.shareToken}`}>
              <Card className="transition-colors hover:border-primary/50">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.client.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{formatDateShort(r.createdAt)}</span>
                    <Badge variant="success">Disponível</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
