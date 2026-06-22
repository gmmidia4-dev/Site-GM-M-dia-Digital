import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { reportSchema } from '@/lib/validations'
import { requireUser, requireStaff, assertClientAccess, accessibleClientIds } from '@/lib/rbac'
import { handleError, ok } from '@/lib/api'
import { generateReport } from '@/lib/reports/generate'

/** Lista relatórios acessíveis (filtra por cliente para o portal). */
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser()
    const ids = await accessibleClientIds(user)
    const clientId = req.nextUrl.searchParams.get('clientId')
    // Restringe sempre aos clientes acessíveis; se um clientId for pedido e não
    // for acessível, a lista resultante fica vazia.
    const filterIds = clientId ? ids.filter((id) => id === clientId) : ids
    const reports = await prisma.report.findMany({
      where: { clientId: { in: filterIds } },
      include: { client: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return ok(reports)
  } catch (err) {
    return handleError(err)
  }
}

/** Cria e gera um relatório (sincroniza dados + agrega + IA). */
export async function POST(req: NextRequest) {
  try {
    const user = await requireStaff()
    const data = reportSchema.parse(await req.json())
    await assertClientAccess(user, data.clientId)

    const report = await prisma.report.create({
      data: {
        agencyId: user.agencyId,
        clientId: data.clientId,
        title: data.title,
        period: data.period,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'DRAFT',
      },
    })

    // Geração síncrona (em produção: fila/worker). Modo demo é rápido.
    const generated = await generateReport(report.id, { includeAi: data.includeAi })
    return ok(generated, 201)
  } catch (err) {
    return handleError(err)
  }
}
