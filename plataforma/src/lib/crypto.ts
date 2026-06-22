import crypto from 'crypto'

/**
 * Criptografia simétrica (AES-256-GCM) para tokens das integrações em repouso.
 * A chave vem de INTEGRATION_ENCRYPTION_KEY (base64, 32 bytes).
 */

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const raw = process.env.INTEGRATION_ENCRYPTION_KEY
  if (!raw) {
    // Em desenvolvimento, evita quebrar quando a chave não está configurada.
    return crypto.createHash('sha256').update('reportia-dev-key').digest()
  }
  const key = Buffer.from(raw, 'base64')
  if (key.length !== 32) {
    return crypto.createHash('sha256').update(raw).digest()
  }
  return key
}

export function encrypt(plain: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  // formato: iv.tag.ciphertext (todos em base64)
  return [iv.toString('base64'), tag.toString('base64'), encrypted.toString('base64')].join('.')
}

export function decrypt(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split('.')
  if (!ivB64 || !tagB64 || !dataB64) throw new Error('Payload cifrado inválido')
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, 'base64'))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ])
  return decrypted.toString('utf8')
}

export function randomToken(bytes = 24): string {
  return crypto.randomBytes(bytes).toString('base64url')
}
