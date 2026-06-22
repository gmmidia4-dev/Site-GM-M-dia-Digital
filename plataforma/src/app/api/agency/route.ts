import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { agencySchema } from '@/lib/validations'
import { requireRole } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

export async function GET() {
  try {
    const user = await requireRole('ADMIN', 'MANAGER')
    const agency = await prisma.agency.findUnique({ where: { id: user.agencyId } })
    return ok(agency)
  } catch (err) {
    return handleError(err)
  }
}

/** Atualiza identidade visual e dados da agência (somente ADMIN). */
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireRole('ADMIN')
    const data = agencySchema.parse(await req.json())
    const agency = await prisma.agency.update({
      where: { id: user.agencyId },
      data: {
        name: data.name,
        website: data.website || null,
        phone: data.phone || null,
        logoUrl: data.logoUrl || null,
        brandPrimary: data.brandPrimary,
        brandSecondary: data.brandSecondary,
      },
    })
    return ok(agency)
  } catch (err) {
    return handleError(err)
  }
}
