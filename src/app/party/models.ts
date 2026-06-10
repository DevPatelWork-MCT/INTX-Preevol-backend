import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()

export const createPartyPayloadModel = z.object({
    PartyName: z.string().min(1).max(255),
    ContactPerson: optionalString(),
    Contact1: optionalString(100),
    Contact2: optionalString(100),
    Address: z.string().nullable().optional(),
    City: optionalString(),
    State: optionalString(),
    Country: optionalString(),
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
    Company: z.string().max(255).nullable().optional(),
    Pin: optionalString(50),
})

export const updatePartyPayloadModel = createPartyPayloadModel.partial()
