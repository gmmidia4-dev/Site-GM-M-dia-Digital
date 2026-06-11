'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchKeys?: (keyof T)[]
  pageSize?: number
  isLoading?: boolean
  emptyMessage?: string
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchable = true,
  searchKeys = [],
  pageSize = 10,
  isLoading = false,
  emptyMessage = 'Nenhum dado encontrado.',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = searchable && search
    ? data.filter((row) =>
        searchKeys.some((key) => {
          const value = row[key]
          return String(value ?? '').toLowerCase().includes(search.toLowerCase())
        })
      )
    : data

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paginatedData = filtered.slice((page - 1) * pageSize, page * pageSize)

  const getNestedValue = (obj: T, key: string): any => {
    return key.split('.').reduce((acc: any, k) => acc?.[k], obj)
  }

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 h-10 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] text-sm text-[#E2E8F0] placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
          />
        </div>
      )}

      <div className="rounded-xl border border-white/5 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 bg-[#111111]">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              Carregando...
            </div>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex items-center justify-center h-40 bg-[#111111]">
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-[#0A0A0A]">
                  {columns.map((col) => (
                    <th
                      key={String(col.key)}
                      className={cn(
                        'text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider',
                        col.className
                      )}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 bg-[#111111] hover:bg-[#1A1A1A] transition-colors"
                  >
                    {columns.map((col) => {
                      const value = getNestedValue(row, String(col.key))
                      return (
                        <td
                          key={String(col.key)}
                          className={cn('px-5 py-4', col.className)}
                        >
                          {col.render ? col.render(value, row) : (
                            <span className="text-sm text-gray-300">{String(value ?? '—')}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-400">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
