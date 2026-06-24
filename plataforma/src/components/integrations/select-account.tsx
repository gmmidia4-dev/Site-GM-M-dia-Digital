'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface AdAccountOption {
  id: string
  name: string
  currency?: string
}

export function SelectAccount({ integrationId }: { integrationId: string }) {
  const router = useRouter()
  const [accounts, setAccounts] = useState<AdAccountOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/integrations/${integrationId}/accounts`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setAccounts(data.accounts ?? [])
      })
      .catch(() => setError('Não foi possível listar as contas.'))
      .finally(() => setLoading(false))
  }, [integrationId])

  async function choose(acc: AdAccountOption) {
    setSaving(acc.id)
    setError('')
    const res = await fetch(`/api/integrations/${integrationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ externalAccountId: acc.id, accountName: acc.name }),
    })
    const data = await res.json()
    setSaving(null)
    if (!res.ok || data.error) {
      setError(data.error || 'Falha ao vincular a conta.')
      return
    }
    router.push('/integracoes?connected=1')
    router.refresh()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-3 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Carregando contas disponíveis…
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="space-y-3 pt-6">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {accounts.length === 0 && !error ? (
          <p className="text-sm text-muted-foreground">Nenhuma conta encontrada para este acesso.</p>
        ) : (
          accounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => choose(acc)}
              disabled={saving !== null}
              className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted disabled:opacity-50"
            >
              <div>
                <p className="font-medium">{acc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {acc.id}
                  {acc.currency ? ` · ${acc.currency}` : ''}
                </p>
              </div>
              {saving === acc.id ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Check className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          ))
        )}
        <Button variant="outline" onClick={() => router.push('/integracoes')} className="mt-2">
          Cancelar
        </Button>
      </CardContent>
    </Card>
  )
}
