import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { userCreateSchema } from '@/lib/validations'
import { requireRole } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'

/** Lista os usuários da agência (sem senhas). */
export async function GET() {
  try {
    const user = await requireRole('ADMIN')
    const users = await prisma.user.findMany({
      where: { agencyId: user.agencyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        clientAccess: { select: { client: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: 'asc' },
    })
    return ok(users)
  } catch (err) {
    return handleError(err)
  }
}

/** Cria um usuário da equipe ou um acesso de cliente final. */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireRole('ADMIN')
    const data = userCreateSchema.parse(await req.json())

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
    if (existing) return ok({ error: 'Já existe um usuário com este e-mail' }, 409)

    // Garante que os clientes pertencem à agência (para papel CLIENT)
    const clientIds = data.role === 'CLIENT' ? data.clientIds ?? [] : []
    if (clientIds.length) {
      const count = await prisma.client.count({
        where: { id: { in: clientIds }, agencyId: admin.agencyId },
      })
      if (count !== clientIds.length) return ok({ error: 'Cliente inválido' }, 400)
    }

    const passwordHash = await bcrypt.hash(data.password, 10)
    const created = await prisma.user.create({
      data: {
        agencyId: admin.agencyId,
        name: data.name,
        email: data.email.toLowerCase(),
        password: passwordHash,
        role: data.role,
        clientAccess: clientIds.length
          ? { create: clientIds.map((clientId) => ({ clientId })) }
          : undefined,
      },
      select: { id: true, name: true, email: true, role: true },
    })
    return ok(created, 201)
  } catch (err) {
    return handleError(err)
  }
}
