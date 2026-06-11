import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
        published: true,
      },
      include: { category: true, tags: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    // Increment views
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Erro ao buscar post' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...body,
        publishedAt: body.published ? new Date() : null,
        updatedAt: new Date(),
      },
      include: { category: true, tags: true },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    await prisma.blogPost.delete({ where: { id: params.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Erro ao deletar post' }, { status: 500 })
  }
}
