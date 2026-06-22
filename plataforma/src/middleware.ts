import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * Protege as áreas autenticadas. O portal público de relatórios (/r/:token)
 * e as rotas de auth permanecem abertos.
 */
export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role
    const path = req.nextUrl.pathname

    // Cliente final não acessa a área administrativa da agência
    const staffOnly = ['/dashboard', '/clientes', '/integracoes', '/configuracoes']
    if (role === 'CLIENT' && staffOnly.some((p) => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/portal', req.url))
    }
    return NextResponse.next()
  },
  {
    pages: { signIn: '/login' },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/clientes/:path*',
    '/integracoes/:path*',
    '/relatorios/:path*',
    '/configuracoes/:path*',
    '/portal/:path*',
  ],
}
