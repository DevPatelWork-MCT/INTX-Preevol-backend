import { z } from 'zod'

// Helper schemas matching the validation table
const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const requiredString = (min: number, max: number) => z.string().min(min).max(max)
const requiredInteger = z.coerce.number().int().positive()
// Optional integer that coerces strings and treats NaN as undefined
const optionalInteger = z.coerce.number().int().positive().nullable().optional().transform((val) => {
    return Number.isNaN(val) ? undefined : val;
})
const optionalTimestamp = z.coerce.date().nullable().optional()

export const createCompanyPayloadModel = z.object({
    // Required fields
    Name: requiredString(1, 50),
    Address: requiredString(1, 250),
    GSTIN: requiredString(15, 15),
    PANNo: requiredString(10, 10),
    Phone1: requiredString(1, 50),
    state: requiredString(1, 100),
    Statecode: requiredInteger,
    EmailID1: z.string().email().min(1).max(150),
    SupplyFrom: requiredString(1, 50),
    // Optional fields
    Phone2: optionalString(50),
    // EmailID2 optional with email format validation
    EmailID2: optionalString(150).refine((val) => val === null || val === undefined || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val), {
        message: 'Invalid email address',
    }).optional(),
    Website: optionalString(150).optional(),
    VATno: optionalInteger,
    CSTNo: optionalInteger,
    ECCNo: optionalString(50).optional(),
    IECCode: optionalString(50).optional(),
    Loc: optionalString(50).optional(),
    Pin: optionalString(50).optional(),
    SignatureImage: optionalString().optional(),
}).strict()

export const updateCompanyPayloadModel = createCompanyPayloadModel.partial().refine((payload) => {
    // No date validation needed as date fields are removed.
})

// ── Pagination & filter query schema ──────────────────────────────
export const listCompaniesQueryModel = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    search: z.string().optional(),
    sortBy: z.enum(["Name", "createdAt", "CompanyID"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})
