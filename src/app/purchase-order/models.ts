import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const optionalDecimal = z.coerce.string().nullable().optional()
const optionalTimestamp = z.coerce.date().nullable().optional()

export const purchaseOrderLineItemModel = z.object({
    ProductName: optionalString(255),
    Description: z.string().nullable().optional(),
    HSNACS: optionalString(100),
    UOM: optionalString(100),
    Qty: optionalDecimal,
    Rate: optionalDecimal,
    Amount: optionalDecimal,
    Discount: optionalDecimal,
    TaxableValue: optionalDecimal,
    CGSTRate: optionalDecimal,
    CGSTAmt: optionalDecimal,
    SGSTRate: optionalDecimal,
    SGSTAmt: optionalDecimal,
    IGSTRate: optionalDecimal,
    IGSTAmt: optionalDecimal,
    TotalAmount: optionalDecimal,
})

export const createPurchaseOrderPayloadModel = z.object({
    PO: optionalString(255),
    PODate: optionalTimestamp,
    VendorID: z.number().int().positive().nullable().optional(),
    DeliverySchedule: optionalString(255),
    QuotRef: optionalString(255),
    TransportorFOR: optionalString(255),
    PaymentDays: optionalString(255),
    AgainstForm: optionalString(255),
    ConsignorName: optionalString(255),
    ConsignorAddress: z.string().nullable().optional(),
    ConsignorGSTIN: optionalString(100),
    ConsignorState: optionalString(100),
    ConsignorStateCode: optionalString(100),
    ConsignorPANNo: optionalString(100),
    TotalAmtBeforeTax: optionalDecimal,
    CGST: optionalDecimal,
    SGST: optionalDecimal,
    IGST: optionalDecimal,
    TotalGSTTax: optionalDecimal,
    TotalAmtAfterTax: optionalDecimal,
    GrandTotalAmount: optionalDecimal,
    TotalInWords: z.string().nullable().optional(),
    Remarks: z.string().nullable().optional(),
    Company: optionalString(255),
    lineItems: z.array(purchaseOrderLineItemModel).optional(),
})

export const updatePurchaseOrderPayloadModel = createPurchaseOrderPayloadModel.partial()
