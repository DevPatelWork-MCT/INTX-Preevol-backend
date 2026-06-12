import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()

export const createVendorPayloadModel = z.object({
    VendorName: z.string().min(1).max(255),
    ContactPerson: optionalString(),
    Contact1: optionalString(100),
    Contact2: optionalString(100),
    Address: z.string().nullable().optional(),
    City: optionalString(),
    State: optionalString(),
    StateCode: z.number().int().positive().nullable().optional(),
    Email: optionalString(),
    Website: optionalString(),
    GSTStatus: optionalString(),
    GSTIN: optionalString(50),
    PANNo: optionalString(50),
    VATNo: z.number().int().positive().nullable().optional(),
    CSTNo: z.number().int().positive().nullable().optional(),
    ECCNo: optionalString(100),
    IECCode: optionalString(100),
    Company: optionalString(),
})

export const updateVendorPayloadModel = createVendorPayloadModel.partial()
