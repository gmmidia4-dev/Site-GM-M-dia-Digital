import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { testimonialSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = { published: true }
    if (featured === 'true') {
      where.featured = true
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    })

    return NextResponse.json({ testimonials })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json({ error: 'Erro ao buscar depoimentos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = testimonialSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        company: data.company,
        content: data.content,
        rating: data.rating,
        avatar: data.avatar,
        videoUrl: data.videoUrl,
        featured: data.featured,
        published: data.published,
      },
    })

    return NextResponse.json({ success: true, testimonial }, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json({ error: 'Erro ao criar depoimento' }, { status: 500 })
  }
}
