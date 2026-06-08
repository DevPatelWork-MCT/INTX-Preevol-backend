import type { Request, Response } from 'express'
import { eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { rolesTable, usersTable } from '../../db/schema.js'
import { deleteAllUserSessions } from '../auth/utils/session.js'
import {
    approveUserPayloadModel,
    createRolePayloadModel,
    updateRolePayloadModel,
    updateUserRolePayloadModel,
} from './models.js'

class AdminController {
    public async handleListUsers(req: Request, res: Response) {
        const status = typeof req.query.status === 'string' ? req.query.status : undefined

        const users = status
            ? await db.select().from(usersTable).where(eq(usersTable.accountStatus, status))
            : await db.select().from(usersTable)

        const usersWithRoles = await Promise.all(users.map(async (user) => {
            let role = null
            if (user.roleId) {
                const [roleResult] = await db.select().from(rolesTable).where(eq(rolesTable.roleId, user.roleId))
                if (roleResult) {
                    role = { roleId: roleResult.roleId, roleName: roleResult.roleName }
                }
            }

            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                company: user.company,
                accountStatus: user.accountStatus,
                isAdmin: user.isAdmin,
                adminRequested: user.adminRequested,
                role,
                createdAt: user.createdAt,
            }
        }))

        return res.json({ data: usersWithRoles })
    }

    public async handleGetUser(req: Request, res: Response) {
        const { id } = req.params

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id as string))

        if (!user) return res.status(404).json({ message: 'User not found' })

        let role = null
        if (user.roleId) {
            const [roleResult] = await db.select().from(rolesTable).where(eq(rolesTable.roleId, user.roleId))
            if (roleResult) {
                role = { roleId: roleResult.roleId, roleName: roleResult.roleName }
            }
        }

        return res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            company: user.company,
            accountStatus: user.accountStatus,
            isAdmin: user.isAdmin,
            adminRequested: user.adminRequested,
            role,
            createdAt: user.createdAt,
        })
    }

    public async handleApproveUser(req: Request, res: Response) {
        const { id } = req.params
        const validationResult = await approveUserPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const { roleId, grantAdmin } = validationResult.data

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id as string))

        if (!user) return res.status(404).json({ message: 'User not found' })

        if (user.accountStatus === 'approved') {
            return res.status(400).json({ message: 'User is already approved' })
        }

        if (roleId) {
            const [role] = await db.select().from(rolesTable).where(eq(rolesTable.roleId, roleId))
            if (!role) return res.status(400).json({ message: 'Invalid roleId' })
        }

        const shouldGrantAdmin = grantAdmin && (user.adminRequested || grantAdmin)

        const [updated] = await db.update(usersTable).set({
            accountStatus: 'approved',
            roleId: roleId ?? user.roleId,
            isAdmin: shouldGrantAdmin,
            adminRequested: shouldGrantAdmin ? false : user.adminRequested,
        }).where(eq(usersTable.id, id as string)).returning()

        return res.json({
            message: 'User approved successfully',
            data: {
                id: updated?.id,
                accountStatus: updated?.accountStatus,
                isAdmin: updated?.isAdmin,
                roleId: updated?.roleId,
            },
        })
    }

    public async handleRejectUser(req: Request, res: Response) {
        const { id } = req.params

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id as string))

        if (!user) return res.status(404).json({ message: 'User not found' })

        if (user.accountStatus === 'rejected') {
            return res.status(400).json({ message: 'User is already rejected' })
        }

        await deleteAllUserSessions(id as string)

        const [updated] = await db.update(usersTable).set({
            accountStatus: 'rejected',
            isAdmin: false,
        }).where(eq(usersTable.id, id as string)).returning()

        return res.json({
            message: 'User rejected successfully',
            data: { id: updated?.id, accountStatus: updated?.accountStatus },
        })
    }

    public async handleUpdateUserRole(req: Request, res: Response) {
        const { id } = req.params
        const validationResult = await updateUserRolePayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const { roleId } = validationResult.data

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id as string))

        if (!user) return res.status(404).json({ message: 'User not found' })

        if (user.accountStatus !== 'approved') {
            return res.status(400).json({ message: 'Can only assign roles to approved users' })
        }

        if (roleId !== null) {
            const [role] = await db.select().from(rolesTable).where(eq(rolesTable.roleId, roleId))
            if (!role) return res.status(400).json({ message: 'Invalid roleId' })
        }

        const [updated] = await db.update(usersTable).set({ roleId }).where(eq(usersTable.id, id as string)).returning()

        return res.json({
            message: 'User role updated successfully',
            data: { id: updated?.id, roleId: updated?.roleId },
        })
    }

    public async handleListRoles(_req: Request, res: Response) {
        const roles = await db.select().from(rolesTable)
        return res.json({ data: roles })
    }

    public async handleCreateRole(req: Request, res: Response) {
        const validationResult = await createRolePayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const { roleName, company } = validationResult.data

        const [role] = await db.insert(rolesTable).values({ roleName, company }).returning()

        return res.status(201).json({ message: 'Role created successfully', data: role })
    }

    public async handleUpdateRole(req: Request, res: Response) {
        const roleId = Number(req.params.id)

        if (Number.isNaN(roleId)) return res.status(400).json({ message: 'Invalid role id' })

        const validationResult = await updateRolePayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const [existing] = await db.select().from(rolesTable).where(eq(rolesTable.roleId, roleId))

        if (!existing) return res.status(404).json({ message: 'Role not found' })

        const [role] = await db.update(rolesTable).set(validationResult.data).where(eq(rolesTable.roleId, roleId)).returning()

        return res.json({ message: 'Role updated successfully', data: role })
    }

    public async handleDeleteRole(req: Request, res: Response) {
        const roleId = Number(req.params.id)

        if (Number.isNaN(roleId)) return res.status(400).json({ message: 'Invalid role id' })

        const [existing] = await db.select().from(rolesTable).where(eq(rolesTable.roleId, roleId))

        if (!existing) return res.status(404).json({ message: 'Role not found' })

        const usersWithRole = await db.select().from(usersTable).where(eq(usersTable.roleId, roleId))

        if (usersWithRole.length > 0) {
            return res.status(400).json({ message: 'Cannot delete role that is assigned to users' })
        }

        await db.delete(rolesTable).where(eq(rolesTable.roleId, roleId))

        return res.json({ message: 'Role deleted successfully' })
    }
}

export default AdminController
