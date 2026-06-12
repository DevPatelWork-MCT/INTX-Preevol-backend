import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const optionalInteger = z.number().int().positive().nullable().optional()
const optionalDecimal = z.coerce.string().nullable().optional()
const optionalBoolean = z.boolean().nullable().optional()

export const createProductPayloadModel = z.object({
    CategoryID: optionalInteger,
    SubCategoryID: optionalInteger,
    ProductName: z.string().min(1).max(255),
    UOM: optionalString(100),
    HSNNoOrSACNo: optionalString(100),
    MachineNo: optionalString(100),
    Price: optionalDecimal,
    FullProductName: optionalString(255),
    IsService: optionalBoolean,
    Company: optionalString(),
})

export const updateProductPayloadModel = createProductPayloadModel.partial()

export const createPOProductPayloadModel = z.object({
    CategoryID: optionalInteger,
    SubCategoryID: optionalInteger,
    ProductName: z.string().min(1).max(255),
    UOM: optionalString(100),
    HSNNoOrSACNo: optionalString(100),
    MachineNo: optionalString(100),
    Price: optionalDecimal,
    FullProductName: optionalString(255),
    Company: optionalString(),
})

export const updatePOProductPayloadModel = createPOProductPayloadModel.partial()
