/**
 * Cliente HTTP resiliente para as integrações: timeout, retry com backoff
 * exponencial e respeito ao cabeçalho `Retry-After` (rate limit).
 */

export class HttpError extends Error {
  status: number
  body: string
  constructor(status: number, body: string) {
    super(`HTTP ${status}: ${body.slice(0, 300)}`)
    this.status = status
    this.body = body
  }
}

export interface FetchOptions extends RequestInit {
  /** Tentativas totais (padrão 3). */
  retries?: number
  /** Tempo limite por tentativa, em ms (padrão 20s). */
  timeoutMs?: number
}

const RETRYABLE = new Set([408, 429, 500, 502, 503, 504])

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

/** Faz uma requisição com retry/backoff e devolve o JSON parseado. */
export async function fetchJson<T = any>(url: string, options: FetchOptions = {}): Promise<T> {
  const { retries = 3, timeoutMs = 20_000, ...init } = options
  let attempt = 0
  let lastErr: unknown

  while (attempt < retries) {
    attempt++
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { ...init, signal: controller.signal })
      clearTimeout(timer)

      if (res.ok) {
        const text = await res.text()
        return (text ? JSON.parse(text) : {}) as T
      }

      const body = await res.text().catch(() => '')
      if (RETRYABLE.has(res.status) && attempt < retries) {
        const retryAfter = Number(res.headers.get('retry-after'))
        const delay = retryAfter > 0 ? retryAfter * 1000 : 2 ** attempt * 500
        await sleep(delay)
        continue
      }
      throw new HttpError(res.status, body)
    } catch (err) {
      clearTimeout(timer)
      lastErr = err
      if (err instanceof HttpError) throw err
      // erro de rede / abort → retry com backoff
      if (attempt < retries) {
        await sleep(2 ** attempt * 500)
        continue
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('Falha na requisição HTTP')
}
