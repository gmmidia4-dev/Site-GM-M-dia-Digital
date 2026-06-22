import Link from 'next/link'
import { Plus, Users, Plug, FileText } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { initials } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const session = await auth()
  const clients = await prisma.client.findMany({
    where: { agencyId: session!.user.agencyId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { integrations: true, reports: true } } },
  })

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Gerencie seus clientes e suas contas de anúncios."
        action={
          <Button asChild>
            <Link href="/clientes/novo">
              <Plus className="h-4 w-4" /> Novo cliente
            </Link>
          </Button>
        }
      />

      {clients.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 font-medium">Nenhum cliente cadastrado</p>
            <p className="mt-1 text-sm text-muted-foreground">Cadastre seu primeiro cliente para começar.</p>
            <Button asChild className="mt-4">
              <Link href="/clientes/novo">
                <Plus className="h-4 w-4" /> Novo cliente
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Link key={c.id} href={`/clientes/${c.id}`}>
              <Card className="h-full transition-colors hover:border-primary/50">
                <CardContent className="flex items-start gap-4 p-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ background: c.brandPrimary || 'hsl(var(--primary))' }}
                  >
                    {initials(c.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{c.name}</p>
                    {c.segment && <p className="text-xs text-muted-foreground">{c.segment}</p>}
                    <div className="mt-3 flex gap-2">
                      <Badge variant="secondary" className="gap-1">
                        <Plug className="h-3 w-3" /> {c._count.integrations}
                      </Badge>
                      <Badge variant="secondary" className="gap-1">
                        <FileText className="h-3 w-3" /> {c._count.reports}
                      </Badge>
                      {!c.isActive && <Badge variant="warning">Inativo</Badge>}
                    </div>
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
