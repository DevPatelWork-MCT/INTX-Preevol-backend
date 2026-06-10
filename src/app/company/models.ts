import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const optionalInteger = z.number().int().positive().nullable().optional()
const optionalTimestamp = z.coerce.date().nullable().optional()

export const createCompanyPayloadModel = z.object({
    Name: z.string().min(1).max(255),
    Address: z.string().nullable().optional(),
    GSTIN: optionalString(50),
    PANNo: optionalString(50),
    Phone1: optionalString(50),
    Phone2: optionalString(50),
    state: optionalString(100),
    Statecode: optionalInteger,
    EmailID1: optionalString(),
    EmailID2: optionalString(),
    Website: optionalString(),
    VATno: optionalInteger,
    CSTNo: optionalInteger,
    ECCNo: optionalString(100),
    IECCode: optionalString(100),
    SupplyFrom: optionalString(),
    FinancialYear: optionalString(100),
    StartDate: optionalTimestamp,
    EndDate: optionalTimestamp,
    SalesInvoiceStarts: optionalString(100),
    ServiceInvoiceStarts: optionalString(100),
    ProformaSalesInvoiceStarts: optionalString(100),
    ProformaServiceInvoiceStarts: optionalString(100),
    SalesInvoicePrefix: optionalString(50),
    ServiceInvoicePrefix: optionalString(50),
    ProformaSalesInvoicePrefix: optionalString(50),
    ProformaServiceInvoicePrefix: optionalString(50),
    QuotationStarts: optionalString(100),
    QuotationPrefix: optionalString(50),
    ProposalStarts: optionalString(100),
    ProposalPrefix: optionalString(50),
    ISOText: z.string().nullable().optional(),
    Loc: optionalString(),
    Pin: optionalString(50),
    SignatureImage: optionalString(),
})

export const updateCompanyPayloadModel = createCompanyPayloadModel.partial()
