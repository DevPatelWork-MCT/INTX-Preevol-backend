import { randomBytes } from 'node:crypto'
import { eq, and, gt } from 'drizzle-orm'
import { db } from '../../../db/index.js'
import { sessionsTable } from '../../../db/schema.js'

const SESSION_EXPIRY_DAYS = Number(process.env.SESSION_EXPIRY_DAYS ?? 7)

function getExpiryDate(): Date {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + SESSION_EXPIRY_DAYS)
    return expiresAt
}

export async function createSession(userId: string) {
    const token = randomBytes(32).toString('hex')
    const expiresAt = getExpiryDate()

    const [session] = await db.insert(sessionsTable).values({
        userId,
        token,
        expiresAt,
    }).returning()

    return session!
}

export async function getSessionByToken(token: string) {
    const [session] = await db.select().from(sessionsTable).where(
        and(
            eq(sessionsTable.token, token),
            gt(sessionsTable.expiresAt, new Date()),
        ),
    )

    return session ?? null
}

export async function deleteSession(token: string) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token))
}

export async function deleteAllUserSessions(userId: string) {
    await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId))
}
