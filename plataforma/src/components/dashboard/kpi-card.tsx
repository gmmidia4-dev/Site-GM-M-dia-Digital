import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  label: string
  value: string
  delta?: number | null
  /** true = variação favorável (verde), false = desfavorável (vermelho) */
  favorable?: boolean | null
  icon?: React.ReactNode
  hint?: string
}

export function KpiCard({ label, value, delta, favorable, icon, hint }: KpiCardProps) {
  const hasDelta = delta !== undefined && delta !== null
  const isUp = (delta ?? 0) > 0
  const color =
    favorable === null || favorable === undefined
      ? 'text-muted-foreground'
      : favorable
        ? 'text-success'
        : 'text-destructive'

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <div className="text-muted-foreground/70">{icon}</div>}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      <div className="mt-1 flex items-center gap-1 text-xs">
        {hasDelta ? (
          <span className={cn('inline-flex items-center gap-0.5 font-medium', color)}>
            {delta === 0 ? (
              <Minus className="h-3 w-3" />
            ) : isUp ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )}
            {Math.abs(delta as number).toFixed(1)}%
          </span>
        ) : (
          <span className="text-muted-foreground">{hint ?? 'sem comparação'}</span>
        )}
        {hasDelta && <span className="text-muted-foreground">vs. período anterior</span>}
      </div>
    </Card>
  )
}
