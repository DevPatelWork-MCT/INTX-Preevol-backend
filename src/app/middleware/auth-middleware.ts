import type { Request, Response, NextFunction } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { rolesTable, usersTable } from '../../db/schema.js'
import { getSessionByToken } from '../auth/utils/session.js'
import type { AuthUser } from '../auth/types.js'

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthUser
    }
}

export function authenticationMiddleware() {
    return async function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers['authorization']
        if (!header) {
            next()
            return
        }

        if (!header.startsWith('Bearer ')) {
            return res.status(400).json({ error: 'authorization header must start with Bearer' })
        }

        const token = header.split(' ')[1]

        if (!token) return res.status(400).json({ error: 'authorization header must start with Bearer and followed by token' })

        const session = await getSessionByToken(token)

        if (!session) {
            delete req.user
            next()
            return
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, session.userId))

        if (!user) {
            delete req.user
            next()
            return
        }

        req.user = {
            id: user.id,
            isAdmin: user.isAdmin,
            roleId: user.roleId,
            accountStatus: user.accountStatus,
            company: user.company,
            sessionToken: token,
        }

        next()
    }
}

export function restrictToAuthenticatedUser() {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) return res.status(401).json({ error: 'Authentication Required' })
        return next()
    }
}

export function restrictToAdmin() {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) return res.status(401).json({ error: 'Authentication Required' })
        if (req.user.accountStatus !== 'approved' || !req.user.isAdmin) {
            return res.status(403).json({ error: 'Admin access required' })
        }
        return next()
    }
}

export function restrictToRole(...roleNames: string[]) {
    return async function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) return res.status(401).json({ error: 'Authentication Required' })

        if (!req.user.roleId) {
            return res.status(403).json({ error: 'Role access required' })
        }

        const [role] = await db.select().from(rolesTable).where(eq(rolesTable.roleId, req.user.roleId))

        if (!role || !roleNames.includes(role.roleName)) {
            return res.status(403).json({ error: 'Insufficient role permissions' })
        }

        return next()
    }
}
