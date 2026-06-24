import { PageHeader } from '@/components/dashboard/page-header'
import { ClientForm } from '@/components/clients/client-form'

export default function NewClientPage() {
  return (
    <>
      <PageHeader title="Novo cliente" description="Cadastre os dados e a identidade visual do cliente." />
      <ClientForm />
    </>
  )
}
