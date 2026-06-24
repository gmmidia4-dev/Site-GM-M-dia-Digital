import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PageHeader } from '@/components/dashboard/page-header'
import { ScheduleManager } from '@/components/schedules/schedule-manager'

export const dynamic = 'force-dynamic'

export default async function SchedulesPage() {
  const session = await auth()
  const [clients, schedules] = await Promise.all([
    prisma.client.findMany({
      where: { agencyId: session!.user.agencyId },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    }),
    prisma.reportSchedule.findMany({
      where: { agencyId: session!.user.agencyId },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return (
    <>
      <PageHeader
        title="Agendamentos"
        description="Envio automático de relatórios diários, semanais e mensais por e-mail, WhatsApp e link."
      />
      <ScheduleManager
        clients={clients}
        schedules={JSON.parse(JSON.stringify(schedules))}
      />
    </>
  )
}
