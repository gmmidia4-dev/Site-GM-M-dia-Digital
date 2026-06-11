import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Users,
  FileText,
  Briefcase,
  Star,
  TrendingUp,
  ArrowRight,
  ArrowUpRight,
  Activity,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Admin GM Mídia Digital',
}

const stats = [
  {
    label: 'Leads Totais',
    value: '—',
    change: 'Carregando...',
    icon: Users,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    href: '/admin/leads',
  },
  {
    label: 'Posts no Blog',
    value: '—',
    change: 'Carregando...',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    href: '/admin/blog',
  },
  {
    label: 'Cases Publicados',
    value: '—',
    change: 'Carregando...',
    icon: Briefcase,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    href: '/admin/cases',
  },
  {
    label: 'Depoimentos',
    value: '—',
    change: 'Carregando...',
    icon: Star,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    href: '/admin/depoimentos',
  },
]

const quickActions = [
  { label: 'Novo Post no Blog', href: '/admin/blog/novo', icon: FileText, color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20' },
  { label: 'Novo Case', href: '/admin/cases/novo', icon: Briefcase, color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20' },
  { label: 'Novo Depoimento', href: '/admin/depoimentos/novo', icon: Star, color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20' },
  { label: 'Ver Leads', href: '/admin/leads', icon: Users, color: 'from-indigo-500/20 to-indigo-500/5', border: 'border-indigo-500/20' },
]

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Bem-vindo ao painel administrativo da GM Mídia Digital.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="p-5 rounded-xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all duration-200 hover:shadow-xl group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div className="text-xs text-gray-600 mt-1">{stat.change}</div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`p-5 rounded-xl bg-gradient-to-br ${action.color} border ${action.border} hover:shadow-lg transition-all duration-200 group`}
                >
                  <Icon className="w-5 h-5 text-white/70 mb-3" />
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  <ArrowRight className="w-3.5 h-3.5 text-white/50 mt-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Atividade Recente</h2>
          <div className="p-5 rounded-xl bg-[#111111] border border-white/5">
            <div className="flex items-center justify-center h-32 text-center">
              <div>
                <Activity className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Conecte ao banco de dados para ver a atividade recente
                </p>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-4 p-5 rounded-xl bg-[#111111] border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-3">Status do Sistema</h3>
            <div className="space-y-3">
              {[
                { label: 'API', status: 'Online', color: 'text-emerald-400', dot: 'bg-emerald-400' },
                { label: 'Banco de Dados', status: 'Verificar .env', color: 'text-amber-400', dot: 'bg-amber-400' },
                { label: 'Email (SMTP)', status: 'Verificar .env', color: 'text-amber-400', dot: 'bg-amber-400' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                    <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
