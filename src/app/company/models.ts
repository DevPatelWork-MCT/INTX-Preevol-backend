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

// ── GSTIN validation: exactly 15 alphanumeric characters ──────────
const gstinSchema = z.string().length(15, 'Please Enter Valid 15 Character GSTIN')

// ── PAN validation: exactly 10 alphanumeric characters ────────────
const panSchema = z.string().length(10, 'Please Enter Valid 10 Character PAN No')

// ── Email regex matching VB.NET pattern ───────────────────────────
const emailRegex = /^[a-zA-Z0-9\._-]+@([a-zA-Z0-9_-]+\.)+([a-zA-Z]{2,3})$/

export const createCompanyPayloadModel = z.object({
    // ── Required fields (20 mandatory per VB.NET) ─────────────────
    Name: requiredString(1, 50),
    Address: requiredString(1, 250),
    GSTIN: gstinSchema,
    PANNo: panSchema,
    Phone1: requiredString(1, 50),
    state: requiredString(1, 100),
    Statecode: requiredInteger,
    EmailID1: z.string().min(1).max(150).regex(emailRegex, 'Not an Email! Enter Valid Email Address'),
    SupplyFrom: requiredString(1, 50),
    FinancialYear: requiredString(1, 10),
    SalesInvoiceStarts: requiredString(1, 10),
    ServiceInvoiceStarts: requiredString(1, 10),
    ProformaSalesInvoiceStarts: requiredString(1, 10),
    ProformaServiceInvoiceStarts: requiredString(1, 10),
    SalesInvoicePrefix: requiredString(1, 20),
    ServiceInvoicePrefix: requiredString(1, 20),
    ProformaSalesInvoicePrefix: requiredString(1, 20),
    ProformaServiceInvoicePrefix: requiredString(1, 20),
    QuotationStarts: requiredString(1, 20),
    QuotationPrefix: requiredString(1, 20),

    // ── Optional fields ──────────────────────────────────────────
    Phone2: optionalString(50),
    EmailID2: optionalString(150).refine((val) => val === null || val === undefined || emailRegex.test(val), {
        message: 'Not an Email! Enter Valid Email Address',
    }).optional(),
    Website: optionalString(150).optional(),
    VATno: optionalInteger,
    CSTNo: optionalInteger,
    ECCNo: optionalString(50).optional(),
    IECCode: optionalString(50).optional(),
    StartDate: optionalTimestamp,
    EndDate: optionalTimestamp,
    Loc: optionalString(50).optional(),
    Pin: optionalString(50).optional(),
    ISOText: optionalString(50).optional(),
    SignatureImage: optionalString().optional(),
    ProposalStarts: optionalString(100).optional(),
    ProposalPrefix: optionalString(50).optional(),
}).strict()

export const updateCompanyPayloadModel = createCompanyPayloadModel.partial().refine((payload) => {
    // At least one field must be provided
    return Object.keys(payload).length > 0
}, {
    message: 'At least one field must be provided for update',
})

// ── Pagination & filter query schema ──────────────────────────────
export const listCompaniesQueryModel = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    search: z.string().optional(),
    sortBy: z.enum(["Name", "createdAt", "CompanyID"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})
