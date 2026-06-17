import jwt, { type SignOptions } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'your-secret-key-change-in-production'
const JWT_EXPIRY = process.env.JWT_EXPIRY ?? '7d'

export interface JwtPayload {
  userId: string
  email: string
  company: string | null
  companyId: number | null
  isAdmin: boolean
  roleId: number | null
  accountStatus: string
}

export function signJwt(payload: JwtPayload): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY } as any)
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}
