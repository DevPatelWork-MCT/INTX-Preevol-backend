import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const optionalInteger = z.number().int().positive().nullable().optional()

export const createBankPayloadModel = z.object({
    CompanyID: optionalInteger,
    BankName: optionalString(),
    AccountNo: optionalString(),
    IFSCCode: optionalString(50),
    SwiftCode: optionalString(100),
    Company: z.string().max(255).nullable().optional(),
})

export const updateBankPayloadModel = createBankPayloadModel.partial()

// ── Pagination & filter query schema ──────────────────────────────
export const listBanksQueryModel = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    search: z.string().optional(),
    sortBy: z.enum(["BankName", "createdAt", "BankID"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
    companyId: z.coerce.number().int().positive().optional(),
})
