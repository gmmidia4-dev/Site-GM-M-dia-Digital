'use client'

import { signOut, useSession } from 'next-auth/react'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { initials } from '@/lib/utils'

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gestor de tráfego',
  CLIENT: 'Cliente',
}

export function Topbar({ onMenu }: { onMenu?: () => void }) {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenu} aria-label="Menu">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <div className="flex items-center gap-2 rounded-lg px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials(user?.name || user?.email)}
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-none">{user?.name ?? 'Usuário'}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABEL[user?.role ?? ''] ?? ''}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: '/login' })} aria-label="Sair">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
