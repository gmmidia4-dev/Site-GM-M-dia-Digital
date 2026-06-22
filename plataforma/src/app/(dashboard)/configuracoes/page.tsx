import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { AgencyForm } from '@/components/settings/agency-form'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const session = await auth()
  if (session!.user.role !== 'ADMIN') redirect('/dashboard')

  const agency = await prisma.agency.findUniqueOrThrow({ where: { id: session!.user.agencyId } })

  return (
    <>
      <PageHeader title="Configurações" description="Personalize a identidade visual aplicada aos relatórios." />
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
