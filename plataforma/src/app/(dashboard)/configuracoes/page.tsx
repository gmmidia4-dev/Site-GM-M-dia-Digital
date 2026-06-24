import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Users2, ChevronRight } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { AgencyForm } from '@/components/settings/agency-form'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await auth()
  if (session!.user.role !== 'ADMIN') redirect('/dashboard')

  const agency = await prisma.agency.findUniqueOrThrow({ where: { id: session!.user.agencyId } })

  return (
    <>
      <PageHeader title="Configurações" description="Personalize a identidade visual aplicada aos relatórios." />

      <Link href="/configuracoes/equipe" className="mb-6 block">
        <Card className="transition-colors hover:border-primary/50">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">Equipe e permissões</p>
                <p className="text-sm text-muted-foreground">Gerencie administradores, gestores e clientes finais.</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <AgencyForm
        agency={{
          name: agency.name,
          website: agency.website,
          phone: agency.phone,
          logoUrl: agency.logoUrl,
          brandPrimary: agency.brandPrimary,
          brandSecondary: agency.brandSecondary,
        }}
      />
    </>
  )
}
