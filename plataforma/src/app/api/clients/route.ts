import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { clientSchema } from '@/lib/validations'
import { requireStaff, requireUser, accessibleClientIds } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

/** Lista clientes acessíveis ao usuário. */
export async function GET() {
  try {
    const user = await requireUser()
    const ids = await accessibleClientIds(user)
    const clients = await prisma.client.findMany({
      where: { id: { in: ids } },
      orderBy: { name: 'asc' },
      include: { _count: { select: { integrations: true, reports: true } } },
    })
    return ok(clients)
  } catch (err) {
    return handleError(err)
  }
}

/** Cadastra um novo cliente (staff). */
export async function POST(req: NextRequest) {
  try {
    const user = await requireStaff()
    const data = clientSchema.parse(await req.json())
    const client = await prisma.client.create({
      data: {
        agencyId: user.agencyId,
        name: data.name,
        logoUrl: data.logoUrl || null,
        segment: data.segment || null,
        brandPrimary: data.brandPrimary || null,
        contactName: data.contactName || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
      },
    })
    return ok(client, 201)
  } catch (err) {
    return handleError(err)
  }
}
