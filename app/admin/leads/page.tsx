'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, RefreshCw, Mail, Phone, Calendar, Tag } from 'lucide-react'
import { formatDateShort } from '@/lib/utils'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  service?: string
  message?: string
  source?: string
  status: string
  createdAt: string
}

const statusColors: Record<string, string> = {
  NEW: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  CONTACTED: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  QUALIFIED: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  CONVERTED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  LOST: 'bg-red-500/15 text-red-400 border-red-500/20',
}

const statusLabels: Record<string, string> = {
  NEW: 'Novo',
  CONTACTED: 'Contactado',
  QUALIFIED: 'Qualificado',
  CONVERTED: 'Convertido',
  LOST: 'Perdido',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const fetchLeads = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(statusFilter ? { status: statusFilter } : {}),
      })
      const response = await fetch(`/api/leads?${params}`)
      const data = await response.json()
      setLeads(data.leads || [])
      setTotal(data.pagination?.total || 0)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [page, statusFilter])

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search)
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">Leads</h1>
          <p className="text-gray-400 mt-1">{total} leads cadastrados no total</p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 h-10 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-sm text-[#E2E8F0] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-sm text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
        >
          <option value="">Todos os status</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {Object.entries(statusLabels).map(([status, label]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            className={`p-3 rounded-xl border text-center transition-all ${
              statusFilter === status
                ? statusColors[status]
                : 'bg-[#111111] border-white/5 hover:border-white/10'
            }`}
          >
            <p className={`text-lg font-black ${statusFilter === status ? '' : 'text-white'}`}>
              {leads.filter((l) => l.status === status).length}
            </p>
            <p className={`text-xs ${statusFilter === status ? '' : 'text-gray-400'}`}>{label}</p>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 bg-[#111111]">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Carregando leads...
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="flex items-center justify-center h-40 bg-[#111111]">
            <p className="text-gray-500">
              {leads.length === 0 ? 'Nenhum lead cadastrado ainda.' : 'Nenhum lead encontrado com os filtros atuais.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-[#0A0A0A]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Contato
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Serviço
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b border-white/5 bg-[#111111] hover:bg-[#1A1A1A] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-white font-medium text-sm">{lead.name}</p>
                        {lead.company && (
                          <p className="text-gray-500 text-xs mt-0.5">{lead.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          {lead.email}
                        </a>
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-400 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          {lead.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-400">{lead.service || '—'}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          statusColors[lead.status] || statusColors.NEW
                        }`}
                      >
                        {statusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="text-xs text-gray-500">
                        {formatDateShort(lead.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 20 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Mostrando {Math.min((page - 1) * 20 + 1, total)}–{Math.min(page * 20, total)} de {total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-400">Página {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * 20 >= total}
              className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
