import { z } from 'zod'

const optionalString = (length?: number) => z.string().max(length ?? 255).nullable().optional()
const optionalDecimal = z.coerce.string().nullable().optional()
const optionalBoolean = z.boolean().nullable().optional()
const optionalTimestamp = z.coerce.date().nullable().optional()

// ── Quotation line item ───────────────────────────────────────────
export const quotationLineItemModel = z.object({
    ProductName: optionalString(255),
    Description: z.string().nullable().optional(),
    HSNACS: optionalString(100),
    UOM: optionalString(100),
    Qty: optionalDecimal,
    Rate: optionalDecimal,
    IsService: optionalString(50),
    Amount: optionalDecimal,
    Discount: optionalDecimal,
    DiscountVal: optionalDecimal,
    TaxableValue: optionalDecimal,
    CGSTRate: optionalDecimal,
    CGSTAmt: optionalDecimal,
    SGSTRate: optionalDecimal,
    SGSTAmt: optionalDecimal,
    IGSTRate: optionalDecimal,
    IGSTAmt: optionalDecimal,
    TotalAmount: optionalDecimal,
})

// ── Create Quotation ──────────────────────────────────────────────
export const createQuotationPayloadModel = z.object({
    QuotationNo: z.string().nullable().optional(),
    QuotationDate: optionalTimestamp,
    ValidUntil: optionalTimestamp,
    TaxType: optionalString(50),
    SupplyTo: optionalString(255),
    SupplyStateCode: z.number().int().positive().nullable().optional(),
    TransportationMode: optionalString(255),
    Distance: optionalString(255),
    VehicleNo: optionalString(255),
    VehicleType: optionalString(255),
    TransporterID: optionalString(255),
    TransporterName: optionalString(255),
    PaymentTerms: optionalString(500),
    DeliveryTerms: optionalString(500),
    Remarks: z.string().nullable().optional(),
    ReceiverName: optionalString(255),
    ReceiverAddress: z.string().nullable().optional(),
    ReceiverGSTIN: optionalString(100),
    ReceiverState: optionalString(100),
    ReceiverStateCode: optionalString(100),
    ReceiverPanNo: optionalString(100),
    ConsigneeName: optionalString(255),
    ConsigneeAddress: z.string().nullable().optional(),
    ConsigneeGSTIN: optionalString(100),
    ConsigneeState: optionalString(100),
    ConsigneeStateCode: optionalString(100),
    ConsigneePanNo: optionalString(100),
    IsSameAddress: optionalBoolean,
    TotalAmtBeforeTax: optionalDecimal,
    PackingCharge: optionalDecimal,
    PCGSTRate: optionalDecimal,
    PCGSTAmt: optionalDecimal,
    PSGSTRate: optionalDecimal,
    PSGSTAmt: optionalDecimal,
    PIGSTRate: optionalDecimal,
    PIGSTAmt: optionalDecimal,
    CGST: optionalDecimal,
    SGST: optionalDecimal,
    IGST: optionalDecimal,
    TotalGSTTax: optionalDecimal,
    TotalAmtAfterTax: optionalDecimal,
    GrandTotalAmount: optionalDecimal,
    RoundOff: optionalDecimal,
    TotalInWords: z.string().nullable().optional(),
    lineItems: z.array(quotationLineItemModel).optional(),
})

export const updateQuotationPayloadModel = createQuotationPayloadModel.partial()

// ── Pagination & filter query schema ──────────────────────────────
export const listQuotationsQueryModel = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    search: z.string().optional(),
    sortBy: z.enum(["QuotationNo", "QuotationDate", "createdAt", "QuotationID"]).optional().default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
})
