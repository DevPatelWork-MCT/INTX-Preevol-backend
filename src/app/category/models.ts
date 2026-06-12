import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const optionalInteger = z.number().int().positive().nullable().optional()

export const createCategoryPayloadModel = z.object({
    CompanyID: optionalInteger,
    CategoryName: z.string().min(1).max(255),
})

export const updateCategoryPayloadModel = createCategoryPayloadModel.partial()

export const createSubCategoryPayloadModel = z.object({
    CategoryID: z.number().int().positive(),
    SubCategoryName: z.string().min(1).max(255),
    Company: optionalString(),
})

export const updateSubCategoryPayloadModel = createSubCategoryPayloadModel.partial()
