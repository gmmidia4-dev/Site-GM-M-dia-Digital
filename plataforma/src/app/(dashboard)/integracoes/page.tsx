import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ConnectForm } from '@/components/integrations/connect-form'
import { DisconnectButton } from '@/components/integrations/disconnect-button'
import { PLATFORM_LABELS } from '@/lib/types'
import { formatDateShort } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: { clientId?: string; connected?: string }
}) {
  const session = await auth()
  const [clients, integrations] = await Promise.all([
    prisma.client.findMany({
      where: { agencyId: session!.user.agencyId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.integration.findMany({
      where: { agencyId: session!.user.agencyId },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <>
      <PageHeader
        title="Integrações"
        description="Conecte Meta Ads, Google Ads, TikTok Ads, GA4 e Search Console aos seus clientes."
      />

      {searchParams.connected && (
        <div className="mb-4 rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          Conta conectada com sucesso.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ConnectForm clients={clients} defaultClientId={searchParams.clientId} />
        </div>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contas conectadas ({integrations.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {integrations.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">
                Nenhuma conta conectada ainda. Use o formulário ao lado.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {integrations.map((i) => (
                  <div key={i.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">{PLATFORM_LABELS[i.platform]}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.client?.name ?? '—'} · {i.accountName || i.externalAccountId}
                      </p>
                      {i.lastSyncedAt && (
                        <p className="text-xs text-muted-foreground">
                          Última sincronização: {formatDateShort(i.lastSyncedAt)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={i.status === 'CONNECTED' ? 'success' : 'destructive'}>
                        {i.status === 'CONNECTED' ? 'Conectado' : i.status}
                      </Badge>
                      <DisconnectButton id={i.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
