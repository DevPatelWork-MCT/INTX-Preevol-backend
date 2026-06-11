import type { Request, Response } from 'express'
import { randomBytes, createHmac } from 'node:crypto'
import { eq } from 'drizzle-orm'
import { signinPayloadModel, signupPayloadModel } from './models.js'
import { db } from '../../db/index.js'
import { rolesTable, usersTable } from '../../db/schema.js'
import { createSession, deleteSession } from './utils/session.js'
import type { AuthUser } from './types.js'

class AuthenticationController {
    public async handleSignup(req: Request, res: Response) {
        const validationResult = await signupPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })

        const { firstName, lastName, email, password, company, isAdmin } = validationResult.data

        const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (userEmailResult.length > 0) return res.status(400).json({ error: 'duplicate entry', message: `user with email ${email} already exists` })

        const salt = randomBytes(32).toString('hex')
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        const [result] = await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            password: hash,
            salt,
            ...(company ? { company } : {}),
            adminRequested: isAdmin,
            isAdmin: false,
            accountStatus: 'pending',
        }).returning({ id: usersTable.id })

        return res.status(201).json({
            message: 'Account created. Awaiting admin approval.',
            data: { id: result?.id },
        })
    }

    public async handleSignin(req: Request, res: Response) {
        const validationResult = await signinPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })

        const { email, password } = validationResult.data

        const [userSelect] = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (!userSelect) return res.status(404).json({ message: `user with email ${email} does not exists` })

        if (userSelect.accountStatus === 'pending') {
            return res.status(403).json({ message: 'Your account is pending admin approval.' })
        }

        if (userSelect.accountStatus === 'rejected') {
            return res.status(403).json({ message: 'Your account has been rejected.' })
        }

        const salt = userSelect.salt!
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        if (userSelect.password !== hash) return res.status(400).json({ message: 'email or password is incorrect' })

        // Create JWT token (stateless — no DB session lookup needed on each request)
        const { signJwt } = await import('./utils/jwt.js')
        const token = signJwt({
            userId: userSelect.id,
            email: userSelect.email,
            company: userSelect.company,
            isAdmin: userSelect.isAdmin,
            roleId: userSelect.roleId,
            accountStatus: userSelect.accountStatus,
        })

        return res.json({
            message: 'Signin Success',
            data: {
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        })
    }

    public async handleSignout(req: Request, res: Response) {
        const user = req.user as AuthUser | undefined
        if (!user?.sessionToken) return res.status(401).json({ error: 'Authentication Required' })

        // Try to delete session (if session-based token), ignore if JWT (stateless)
        try {
            await deleteSession(user.sessionToken)
        } catch {
            // JWT tokens are stateless — no server-side cleanup needed
        }

        return res.json({ message: 'Signed out successfully' })
    }

    public async handleMe(req: Request, res: Response) {
        const { id } = req.user as AuthUser

        const [userResult] = await db.select().from(usersTable).where(eq(usersTable.id, id))

        if (!userResult) return res.status(404).json({ message: 'User not found' })

        let role = null
        if (userResult.roleId) {
            const [roleResult] = await db.select().from(rolesTable).where(eq(rolesTable.roleId, userResult.roleId))
            if (roleResult) {
                role = { roleId: roleResult.roleId, roleName: roleResult.roleName }
            }
        }

        return res.json({
            id: userResult.id,
            firstName: userResult.firstName,
            lastName: userResult.lastName,
            email: userResult.email,
            company: userResult.company,
            accountStatus: userResult.accountStatus,
            isAdmin: userResult.isAdmin,
            adminRequested: userResult.adminRequested,
            role,
        })
    }
}

export default AuthenticationController
