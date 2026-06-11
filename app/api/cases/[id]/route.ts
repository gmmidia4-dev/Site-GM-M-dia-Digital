import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const caseItem = await prisma.case.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        published: true,
      },
    })

    if (!caseItem) {
      return NextResponse.json({ error: 'Case não encontrado' }, { status: 404 })
    }

    return NextResponse.json({ case: caseItem })
  } catch (error) {
    console.error('Error fetching case:', error)
    return NextResponse.json({ error: 'Erro ao buscar case' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()

    const updatedCase = await prisma.case.update({
      where: { id: params.id },
      data: { ...body, updatedAt: new Date() },
    })

    return NextResponse.json({ success: true, case: updatedCase })
  } catch (error) {
    console.error('Error updating case:', error)
    return NextResponse.json({ error: 'Erro ao atualizar case' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.case.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting case:', error)
    return NextResponse.json({ error: 'Erro ao deletar case' }, { status: 500 })
  }
}
