import { redirect } from 'next/navigation'
import { BarChart3 } from 'lucide-react'
import { auth } from '@/lib/auth'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { SignOutButton } from '@/components/portal/sign-out-button'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">Portal do cliente</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4 lg:p-8">{children}</main>
    </div>
  )
}
