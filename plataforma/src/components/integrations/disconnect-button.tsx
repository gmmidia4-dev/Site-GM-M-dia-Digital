'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DisconnectButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function remove() {
    if (!confirm('Desconectar esta conta? As métricas já coletadas serão removidas.')) return
    setLoading(true)
    await fetch(`/api/integrations/${id}`, { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  return (
    <Button variant="ghost" size="icon" onClick={remove} disabled={loading} aria-label="Desconectar">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
    </Button>
  )
}
