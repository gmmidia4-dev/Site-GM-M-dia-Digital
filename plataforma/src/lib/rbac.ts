import type { Role } from '@prisma/client'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export class AuthError extends Error {
  status: number
  constructor(message: string, status = 401) {
    super(message)
    this.status = status
  }
}

export interface SessionUser {
  id: string
  email: string
  name?: string | null
  role: Role
  agencyId: string
}

/** Retorna o usuário da sessão ou lança AuthError (401). */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth()
  if (!session?.user) throw new AuthError('Não autenticado', 401)
  return session.user as SessionUser
}

/** Exige que o usuário tenha um dos papéis informados (403 caso contrário). */
export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const user = await requireUser()
  if (!roles.includes(user.role)) {
    throw new AuthError('Acesso negado', 403)
  }
  return user
}

/** Equivalente a ADMIN ou MANAGER (equipe da agência). */
export async function requireStaff(): Promise<SessionUser> {
  return requireRole('ADMIN', 'MANAGER')
}

/**
 * Garante que o usuário pode acessar o cliente informado:
 * - ADMIN/MANAGER: qualquer cliente da própria agência;
 * - CLIENT: somente clientes explicitamente vinculados (ClientUser).
 */
export async function assertClientAccess(user: SessionUser, clientId: string): Promise<void> {
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true, agencyId: true },
  })
  if (!client || client.agencyId !== user.agencyId) {
    throw new AuthError('Cliente não encontrado', 404)
  }
  if (user.role === 'CLIENT') {
    const link = await prisma.clientUser.findUnique({
      where: { userId_clientId: { userId: user.id, clientId } },
    })
    if (!link) throw new AuthError('Acesso negado a este cliente', 403)
  }
}

/** Lista os IDs de clientes que o usuário pode visualizar. */
export async function accessibleClientIds(user: SessionUser): Promise<string[]> {
  if (user.role === 'CLIENT') {
    const links = await prisma.clientUser.findMany({
      where: { userId: user.id },
      select: { clientId: true },
    })
    return links.map((l) => l.clientId)
  }
  const clients = await prisma.client.findMany({
    where: { agencyId: user.agencyId },
    select: { id: true },
  })
  return clients.map((c) => c.id)
}
