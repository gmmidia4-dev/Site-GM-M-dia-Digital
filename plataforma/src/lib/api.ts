import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { AuthError } from './rbac'

/** Converte exceções conhecidas em respostas HTTP padronizadas. */
export function handleError(err: unknown): NextResponse {
  if (err instanceof AuthError) {
    return NextResponse.json({ error: err.message }, { status: err.status })
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: 'Dados inválidos', details: err.flatten().fieldErrors },
      { status: 400 }
    )
  }
  console.error('[api] erro não tratado:', err)
  return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
}

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status })
}
