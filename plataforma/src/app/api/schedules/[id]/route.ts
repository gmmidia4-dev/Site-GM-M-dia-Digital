import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireStaff, AuthError } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'
import { computeNextRun } from '@/lib/reports/schedule'

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).optional(),
  channels: z.array(z.enum(['EMAIL', 'WHATSAPP', 'LINK'])).optional(),
  recipients: z.array(z.string()).optional(),
  includeAi: z.boolean().optional(),
})

async function own(id: string, agencyId: string) {
  const schedule = await prisma.reportSchedule.findUnique({ where: { id } })
  if (!schedule || schedule.agencyId !== agencyId) throw new AuthError('Agendamento não encontrado', 404)
  return schedule
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    await own(params.id, user.agencyId)
    const data = patchSchema.parse(await req.json())
    const updated = await prisma.reportSchedule.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(data.frequency ? { nextRunAt: computeNextRun(data.frequency) } : {}),
      },
    })
    return ok(updated)
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    await own(params.id, user.agencyId)
    await prisma.reportSchedule.delete({ where: { id: params.id } })
    return ok({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
