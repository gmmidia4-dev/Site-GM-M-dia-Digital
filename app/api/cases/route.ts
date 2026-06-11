import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { caseSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '9')
    const niche = searchParams.get('niche')
    const featured = searchParams.get('featured')
    const skip = (page - 1) * limit

    const where: any = { published: true }

    if (niche) {
      where.niche = niche
    }

    if (featured === 'true') {
      where.featured = true
    }

    const [cases, total] = await Promise.all([
      prisma.case.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.case.count({ where }),
    ])

    // Get distinct niches for filter
    const niches = await prisma.case.findMany({
      where: { published: true },
      select: { niche: true },
      distinct: ['niche'],
    })

    return NextResponse.json({
      cases,
      niches: niches.map((n) => n.niche),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching cases:', error)
    return NextResponse.json({ error: 'Erro ao buscar cases' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validationResult = caseSchema.safeParse(body)

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
    const slug = data.slug || slugify(data.title)

    const newCase = await prisma.case.create({
      data: {
        client: data.client,
        niche: data.niche,
        title: data.title,
        slug,
        description: data.description,
        results: data.results,
        images: data.images,
        featured: data.featured,
        published: data.published,
      },
    })

    return NextResponse.json({ success: true, case: newCase }, { status: 201 })
  } catch (error) {
    console.error('Error creating case:', error)
    return NextResponse.json({ error: 'Erro ao criar case' }, { status: 500 })
  }
}
