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
