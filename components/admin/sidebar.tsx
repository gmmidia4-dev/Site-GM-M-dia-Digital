'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  Star,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Leads', href: '/admin/leads', icon: Users },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Cases', href: '/admin/cases', icon: Briefcase },
  { label: 'Depoimentos', href: '/admin/depoimentos', icon: Star },
  { label: 'Serviços', href: '/admin/servicos', icon: Settings },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm">GM Mídia Digital</p>
          <p className="text-gray-500 text-xs">Painel Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-all duration-200',
                isActive
                  ? 'bg-indigo-500/10 text-white border border-indigo-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-indigo-400' : '')} />
              {item.label}
              {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 mb-1"
        >
          <Zap className="w-4 h-4" />
          Ver Site
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 w-full">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </div>
  )
}
