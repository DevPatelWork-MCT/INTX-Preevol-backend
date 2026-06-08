import { z } from 'zod'

export const approveUserPayloadModel = z.object({
    roleId: z.number().int().positive().optional(),
    grantAdmin: z.boolean().optional().default(false),
})

export const updateUserRolePayloadModel = z.object({
    roleId: z.number().int().positive().nullable(),
})

export const createRolePayloadModel = z.object({
    roleName: z.string().min(1).max(100),
    company: z.string().max(100).nullable().optional(),
})

export const updateRolePayloadModel = z.object({
    roleName: z.string().min(1).max(100).optional(),
    company: z.string().max(100).nullable().optional(),
})
