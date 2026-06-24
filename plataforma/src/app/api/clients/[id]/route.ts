import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { clientSchema } from '@/lib/validations'
import { requireStaff, requireUser, assertClientAccess } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireUser()
    await assertClientAccess(user, params.id)
    const client = await prisma.client.findUnique({
      where: { id: params.id },
      include: { integrations: true, reports: { orderBy: { createdAt: 'desc' }, take: 10 } },
    })
    return ok(client)
  } catch (err) {
    return handleError(err)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    await assertClientAccess(user, params.id)
    const data = clientSchema.partial().parse(await req.json())
    const client = await prisma.client.update({ where: { id: params.id }, data })
    return ok(client)
  } catch (err) {
    return handleError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireStaff()
    await assertClientAccess(user, params.id)
    await prisma.client.delete({ where: { id: params.id } })
    return ok({ success: true })
  } catch (err) {
    return handleError(err)
  }
}
