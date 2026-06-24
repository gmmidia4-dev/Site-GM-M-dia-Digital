import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validations'
import { handleError, ok } from '@/lib/api'
import { slugify } from '@/lib/utils'

/** Cria uma nova agência + usuário administrador (onboarding). */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = registerSchema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } })
    if (existing) {
      return ok({ error: 'Já existe uma conta com este e-mail' }, 409)
    }

    // slug único para a agência
    let slug = slugify(data.agencyName) || 'agencia'
    let n = 1
    while (await prisma.agency.findUnique({ where: { slug } })) {
      slug = `${slugify(data.agencyName)}-${n++}`
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const agency = await prisma.agency.create({
      data: {
        name: data.agencyName,
        slug,
        users: {
          create: {
            name: data.name,
            email: data.email.toLowerCase(),
            password: passwordHash,
            role: 'ADMIN',
          },
        },
      },
    })

    return ok({ success: true, agencyId: agency.id }, 201)
  } catch (err) {
    return handleError(err)
  }
}
