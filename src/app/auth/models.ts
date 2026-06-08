import { z } from 'zod'

export const signupPayloadModel = z.object({
    firstName: z.string().min(2),
    lastName: z.string().nullable().optional(),
    email: z.string().email().toLowerCase().max(322),
    password: z.string().min(6).max(100),
    company: z.string().nullable().optional(),
    isAdmin: z.boolean().optional().default(false),
})

export const signinPayloadModel = z.object({
    email: z.string().email().toLowerCase().max(322),
    password: z.string().min(6).max(100),
    company: z.string().nullable().optional(),
})
