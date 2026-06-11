import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const requiredInteger = z.number().int().positive()
const optionalInteger = z.number().int().positive().nullable().optional()
const requiredTimestamp = z.coerce.date()

export const createFinancialYearPayloadModel = z.object({
    CompanyID: requiredInteger,
    FinancialYear: z.string().min(1).max(100),
    StartDate: requiredTimestamp,
    EndDate: requiredTimestamp,
    SalesInvoiceCount: optionalString(100),
    ServiceInvoiceCount: optionalString(100),
    ProformaSalesInvoiceCount: optionalString(100),
    ProformaServiceInvoiceCount: optionalString(100),
    QuotationCount: optionalString(100),
    ProposalCount: optionalString(100),
}).refine((payload) => payload.EndDate > payload.StartDate, {
    message: 'EndDate must be after StartDate',
    path: ['EndDate'],
})

export const updateFinancialYearPayloadModel = z.object({
    FinancialYear: z.string().min(1).max(100).optional(),
    StartDate: requiredTimestamp.optional(),
    EndDate: requiredTimestamp.optional(),
    SalesInvoiceCount: optionalString(100),
    ServiceInvoiceCount: optionalString(100),
    ProformaSalesInvoiceCount: optionalString(100),
    ProformaServiceInvoiceCount: optionalString(100),
    QuotationCount: optionalString(100),
    ProposalCount: optionalString(100),
}).refine((payload) => !payload.StartDate || !payload.EndDate || payload.EndDate > payload.StartDate, {
    message: 'EndDate must be after StartDate',
    path: ['EndDate'],
})

export const financialYearParamsModel = z.object({
    companyId: requiredInteger,
    financialYearId: optionalInteger,
})
