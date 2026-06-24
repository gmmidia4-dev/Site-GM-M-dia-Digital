import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { ClientForm } from '@/components/clients/client-form'

export const dynamic = 'force-dynamic'

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const session = await auth()
  const client = await prisma.client.findUnique({ where: { id: params.id } })
  if (!client) notFound()
  if (client.agencyId !== session!.user.agencyId) redirect('/clientes')

  return (
    <>
      <PageHeader title={`Editar ${client.name}`} description="Atualize os dados do cliente." />
      <ClientForm
        client={{
          id: client.id,
          name: client.name,
          segment: client.segment,
          brandPrimary: client.brandPrimary,
          logoUrl: client.logoUrl,
          contactName: client.contactName,
          contactEmail: client.contactEmail,
          contactPhone: client.contactPhone,
        }}
      />
    </>
  )
}
