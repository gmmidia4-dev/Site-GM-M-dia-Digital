import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { FileText, Mail, Phone, Plug, Plus, Pencil } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PLATFORM_LABELS } from '@/lib/types'
import { formatDateShort, initials } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      integrations: true,
      reports: { orderBy: { createdAt: 'desc' }, take: 8 },
    },
  })
  if (!client) notFound()
  if (client.agencyId !== session!.user.agencyId) redirect('/clientes')

  return (
    <>
      <PageHeader
        title={client.name}
        description={client.segment ?? 'Cliente'}
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/clientes/${client.id}/editar`}>
                <Pencil className="h-4 w-4" /> Editar
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/integracoes?clientId=${client.id}`}>
                <Plug className="h-4 w-4" /> Conectar conta
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/relatorios/novo?clientId=${client.id}`}>
                <Plus className="h-4 w-4" /> Gerar relatório
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold text-white"
                style={{ background: client.brandPrimary || 'hsl(var(--primary))' }}
              >
                {initials(client.name)}
              </span>
              <div>
                <p className="font-medium">{client.name}</p>
                <Badge variant={client.isActive ? 'success' : 'warning'}>
                  {client.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            {client.contactName && <p className="text-muted-foreground">Responsável: {client.contactName}</p>}
            {client.contactEmail && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {client.contactEmail}
              </p>
            )}
            {client.contactPhone && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {client.contactPhone}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Contas de anúncios</CardTitle>
            <Badge variant="secondary">{client.integrations.length}</Badge>
          </CardHeader>
          <CardContent>
            {client.integrations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma conta conectada.{' '}
                <Link href={`/integracoes?clientId=${client.id}`} className="text-primary hover:underline">
                  Conectar agora
                </Link>
                .
              </p>
            ) : (
              <div className="space-y-2">
                {client.integrations.map((i) => (
                  <div key={i.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <p className="text-sm font-medium">{PLATFORM_LABELS[i.platform]}</p>
                      <p className="text-xs text-muted-foreground">{i.accountName || i.externalAccountId}</p>
                    </div>
                    <Badge variant={i.status === 'CONNECTED' ? 'success' : 'destructive'}>
                      {i.status === 'CONNECTED' ? 'Conectado' : i.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Relatórios recentes</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-0">
          {client.reports.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Nenhum relatório gerado para este cliente.</p>
          ) : (
            <div className="divide-y divide-border">
              {client.reports.map((r) => (
                <Link
                  key={r.id}
                  href={`/relatorios/${r.id}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/40"
                >
                  <span className="text-sm font-medium">{r.title}</span>
                  <span className="text-xs text-muted-foreground">{formatDateShort(r.createdAt)}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
