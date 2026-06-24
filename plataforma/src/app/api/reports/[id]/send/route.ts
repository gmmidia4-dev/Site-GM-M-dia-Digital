import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { requireStaff, assertClientAccess } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'
import { deliverReport } from '@/lib/reports/deliver'

const sendSchema = z.object({
  channels: z.array(z.enum(['EMAIL', 'WHATSAPP', 'LINK'])).min(1),
  recipients: z.array(z.string()).min(1),
})

/** Envia o relatório pelos canais escolhidos (e-mail / WhatsApp / link). */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    const report = await prisma.report.findUnique({ where: { id: params.id } })
    if (!report) return ok({ error: 'Relatório não encontrado' }, 404)
    await assertClientAccess(user, report.clientId)

    const { channels, recipients } = sendSchema.parse(await req.json())
    const result = await deliverReport(params.id, channels, recipients)
    return ok({ success: true, ...result })
  } catch (err) {
    return handleError(err)
  }
}
