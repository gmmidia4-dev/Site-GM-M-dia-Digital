import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { scheduleSchema } from '@/lib/validations'
import { requireStaff, assertClientAccess } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'
import { computeNextRun } from '@/lib/reports/schedule'

/** Lista os agendamentos da agência. */
export async function GET() {
  try {
    const user = await requireStaff()
    const schedules = await prisma.reportSchedule.findMany({
      where: { agencyId: user.agencyId },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return ok(schedules)
  } catch (err) {
    return handleError(err)
  }
}

/** Cria um agendamento automático para um cliente. */
export async function POST(req: NextRequest) {
  try {
    const user = await requireStaff()
    const data = scheduleSchema.parse(await req.json())
    await assertClientAccess(user, data.clientId)

    const schedule = await prisma.reportSchedule.create({
      data: {
        agencyId: user.agencyId,
        clientId: data.clientId,
        frequency: data.frequency,
        channels: data.channels,
        recipients: data.recipients,
        includeAi: data.includeAi,
        isActive: true,
        nextRunAt: computeNextRun(data.frequency),
      },
    })
    return ok(schedule, 201)
  } catch (err) {
    return handleError(err)
  }
}
