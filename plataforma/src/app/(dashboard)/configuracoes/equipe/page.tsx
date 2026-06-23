import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { TeamManager } from '@/components/settings/team-manager'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const session = await auth()
  if (session!.user.role !== 'ADMIN') redirect('/dashboard')

  const [users, clients] = await Promise.all([
    prisma.user.findMany({
      where: { agencyId: session!.user.agencyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        clientAccess: { select: { client: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.client.findMany({
      where: { agencyId: session!.user.agencyId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <>
      <Link href="/configuracoes" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Configurações
      </Link>
      <PageHeader
        title="Equipe e permissões"
        description="Administradores, gestores de tráfego e clientes finais (acesso restrito aos próprios relatórios)."
      />
      <TeamManager users={users as any} clients={clients} currentUserId={session!.user.id} />
    </>
  )
}
