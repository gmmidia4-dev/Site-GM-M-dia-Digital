import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/dashboard/page-header'
import { SelectAccount } from '@/components/integrations/select-account'

export const dynamic = 'force-dynamic'

export default function SelectAccountPage({ searchParams }: { searchParams: { id?: string } }) {
  if (!searchParams.id) redirect('/integracoes')

  return (
    <>
      <PageHeader
        title="Selecionar conta"
        description="Escolha a conta de anúncios que será vinculada a este cliente."
      />
      <SelectAccount integrationId={searchParams.id} />
    </>
  )
}
