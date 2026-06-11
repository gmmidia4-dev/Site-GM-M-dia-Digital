import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Settings } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serviços — Admin GM Mídia Digital',
}

export default function AdminServicosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Serviços</h1>
          <p className="text-gray-400 mt-1">Gerencie os serviços exibidos no site</p>
        </div>
        <Link
          href="/admin/servicos/novo"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </Link>
      </div>

      <div className="rounded-xl border border-white/5 overflow-hidden bg-[#111111]">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <Settings className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Conecte ao banco de dados para gerenciar serviços</p>
          </div>
        </div>
      </div>
    </div>
  )
}
