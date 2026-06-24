'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

interface ClientOption {
  id: string
  name: string
}
interface TeamUser {
  id: string
  name: string | null
  email: string
  role: 'ADMIN' | 'MANAGER' | 'CLIENT'
  clientAccess: { client: { id: string; name: string } }[]
}

const ROLE: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' }> = {
  ADMIN: { label: 'Administrador', variant: 'default' },
  MANAGER: { label: 'Gestor de tráfego', variant: 'success' },
  CLIENT: { label: 'Cliente final', variant: 'secondary' },
}

export function TeamManager({
  users,
  clients,
  currentUserId,
}: {
  users: TeamUser[]
  clients: ClientOption[]
  currentUserId: string
}) {
  const router = useRouter()
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'CLIENT'>('MANAGER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const clientIds = clients.filter((c) => form.get(`cl_${c.id}`)).map((c) => c.id)
    const payload = {
      name: String(form.get('name')),
      email: String(form.get('email')),
      password: String(form.get('password')),
      role,
      clientIds,
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok || data.error) {
      setError(data.error || 'Não foi possível criar o usuário.')
      return
    }
    ;(e.target as HTMLFormElement).reset()
    setRole('MANAGER')
    router.refresh()
  }

  async function remove(id: string) {
    if (!confirm('Remover este usuário?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4 text-primary" /> Adicionar usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={create} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha provisória</Label>
              <Input id="password" name="password" type="text" minLength={8} placeholder="mínimo 8 caracteres" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Papel</Label>
              <Select id="role" value={role} onChange={(e) => setRole(e.target.value as any)}>
                <option value="MANAGER">Gestor de tráfego</option>
                <option value="ADMIN">Administrador</option>
                <option value="CLIENT">Cliente final</option>
              </Select>
            </div>
            {role === 'CLIENT' && (
              <div className="space-y-2">
                <Label>Clientes que poderá ver</Label>
                <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
                  {clients.length === 0 && <p className="text-xs text-muted-foreground">Cadastre clientes primeiro.</p>}
                  {clients.map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name={`cl_${c.id}`} className="h-4 w-4 accent-[hsl(var(--primary))]" />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Adicionar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Equipe ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="font-medium">
                    {u.name} {u.id === currentUserId && <span className="text-xs text-muted-foreground">(você)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                  {u.role === 'CLIENT' && u.clientAccess.length > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Acesso: {u.clientAccess.map((a) => a.client.name).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={ROLE[u.role].variant}>{ROLE[u.role].label}</Badge>
                  {u.id !== currentUserId && (
                    <Button variant="ghost" size="icon" onClick={() => remove(u.id)} aria-label="Remover">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
