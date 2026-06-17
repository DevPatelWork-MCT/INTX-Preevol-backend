import type { Request, Response } from 'express'
import { and, eq, desc, gte, lte, ne, sql } from 'drizzle-orm'
import { db } from '../../db/index.js'
import {
    invoiceTable, invoiceDetailTable,
    serviceInvoiceTable, serviceInvoiceDetailTable,
    proformaInvoiceTable, proformaServiceInvoiceTable, proformaServiceInvoiceDetailTable,
    companyTable, financialSettingsTable, partyTable, productTable,
} from '../../db/schema.js'
import { createInvoicePayloadModel, updateInvoicePayloadModel } from './models.js'

// ── Helper: Convert empty/undefined/null to null ──────────────────
const toNullable = (value: unknown): unknown => {
    if (value === '' || value === undefined || value === null) return null
    return value
}

// ── Helper: Convert to decimal number ─────────────────────────────
const toDecimal = (value: unknown): number => {
    if (value === '' || value === undefined || value === null) return 0
    if (typeof value === 'boolean') return value ? 1 : 0
    const num = Number(value)
    return isNaN(num) ? 0 : num
}

// ── Helper: Round to 2 decimal places ─────────────────────────────
const round2 = (val: number): number => Math.round(val * 100) / 100

// ── Helper: Generate invoice number ────────────────────────────────
// Format: [Prefix] / [Count] / [FinancialYear]
// e.g., "SI/001/24-25"
async function generateInvoiceNumber(companyName: string, invoiceType: string): Promise<{ invoiceNo: string; count: number }> {
    // Determine which counter field to use based on invoice type
    let counterField: 'SalesInvoiceCount' | 'ServiceInvoiceCount' | 'ProformaSalesInvoiceCount' | 'ProformaServiceInvoiceCount'
    let prefixField: 'SalesInvoicePrefix' | 'ServiceInvoicePrefix' | 'ProformaSalesInvoicePrefix' | 'ProformaServiceInvoicePrefix'

    if (invoiceType.includes('Service') && invoiceType.includes('Proforma')) {
        counterField = 'ProformaServiceInvoiceCount'
        prefixField = 'ProformaServiceInvoicePrefix'
    } else if (invoiceType.includes('Service')) {
        counterField = 'ServiceInvoiceCount'
        prefixField = 'ServiceInvoicePrefix'
    } else if (invoiceType.includes('Proforma')) {
        counterField = 'ProformaSalesInvoiceCount'
        prefixField = 'ProformaSalesInvoicePrefix'
    } else {
        counterField = 'SalesInvoiceCount'
        prefixField = 'SalesInvoicePrefix'
    }

    // Get company data
    const [company] = await db.select().from(companyTable).where(eq(companyTable.Name, companyName)).limit(1)
    if (!company) throw new Error('Company not found')

    const financialYear = (company as any).FinancialYear
    const prefix = (company as any)[prefixField] || 'INV/'

    // Get current count from FinancialSettings
    const [fySettings] = await db
        .select()
        .from(financialSettingsTable)
        .where(and(
            eq(financialSettingsTable.CompanyID, (company as any).CompanyID),
            eq(financialSettingsTable.FinancialYear, financialYear),
        ))
        .limit(1)

    const currentCount = fySettings ? Number((fySettings as any)[counterField] || 0) : 0
    const nextCount = currentCount + 1
    const countStr = String(nextCount).padStart(3, '0')

    return {
        invoiceNo: `${prefix}${countStr}/${financialYear}`,
        count: nextCount,
    }
}

// ── Helper: Increment invoice counter in FinancialSettings ─────────
async function incrementInvoiceCounter(companyId: number, financialYear: string, invoiceType: string, newCount: number): Promise<void> {
    let counterField: 'SalesInvoiceCount' | 'ServiceInvoiceCount' | 'ProformaSalesInvoiceCount' | 'ProformaServiceInvoiceCount'

    if (invoiceType.includes('Service') && invoiceType.includes('Proforma')) {
        counterField = 'ProformaServiceInvoiceCount'
    } else if (invoiceType.includes('Service')) {
        counterField = 'ServiceInvoiceCount'
    } else if (invoiceType.includes('Proforma')) {
        counterField = 'ProformaSalesInvoiceCount'
    } else {
        counterField = 'SalesInvoiceCount'
    }

    const countStr = String(newCount).padStart(3, '0')

    // Update the counter
    await db.update(financialSettingsTable)
        .set({ [counterField]: countStr } as any)
        .where(and(
            eq(financialSettingsTable.CompanyID, companyId),
            eq(financialSettingsTable.FinancialYear, financialYear),
        ))
}

// ── Helper: Calculate line item amounts ────────────────────────────
// Matches VB.NET InvoiceDetailGridView_CellValueChanged logic
function calculateLineItem(item: any, isIGST: boolean, isSEZorExport: boolean) {
    const qty = toDecimal(item.Qty)
    const rate = toDecimal(item.Rate)
    const discount = toDecimal(item.Discount)
    const cgstRate = toDecimal(item.CGSTRate)
    const sgstRate = toDecimal(item.SGSTRate)
    const igstRate = toDecimal(item.IGSTRate)

    const amount = round2(qty * rate)
    const discountVal = round2(amount * discount / 100)
    const taxableValue = round2(amount - discountVal)

    let cgstAmt = 0, sgstAmt = 0, igstAmt = 0

    if (isSEZorExport) {
        // Zero-rated supply for SEZ/Export
        cgstAmt = 0; sgstAmt = 0; igstAmt = 0
    } else if (isIGST) {
        igstAmt = round2(taxableValue * igstRate / 100)
    } else {
        cgstAmt = round2(taxableValue * cgstRate / 100)
        sgstAmt = round2(taxableValue * sgstRate / 100)
    }

    const totalAmount = round2(taxableValue + cgstAmt + sgstAmt + igstAmt)

    return {
        ...item,
        Amount: amount,
        DiscountVal: discountVal,
        TaxableValue: taxableValue,
        CGSTAmt: cgstAmt,
        SGSTAmt: sgstAmt,
        IGSTAmt: igstAmt,
        TotalAmount: totalAmount,
    }
}

// ── Helper: Calculate header totals ────────────────────────────────
// Matches VB.NET Calc() function
function calculateHeaderTotals(lineItems: any[], packingCharge: number, pcCgstRate: number, pcSgstRate: number, pcIgstRate: number, isIGST: boolean, isSEZorExport: boolean) {
    let sumTaxableValue = 0, sumCgst = 0, sumSgst = 0, sumIgst = 0

    for (const item of lineItems) {
        sumTaxableValue += toDecimal(item.TaxableValue)
        sumCgst += toDecimal(item.CGSTAmt)
        sumSgst += toDecimal(item.SGSTAmt)
        sumIgst += toDecimal(item.IGSTAmt)
    }

    const totalAmtBeforeTax = round2(sumTaxableValue + toDecimal(packingCharge))

    // Packing charge tax
    let pcCgstAmt = 0, pcSgstAmt = 0, pcIgstAmt = 0
    if (isSEZorExport) {
        pcCgstAmt = 0; pcSgstAmt = 0; pcIgstAmt = 0
    } else if (isIGST) {
        pcIgstAmt = round2(toDecimal(packingCharge) * toDecimal(pcIgstRate) / 100)
    } else {
        pcCgstAmt = round2(toDecimal(packingCharge) * toDecimal(pcCgstRate) / 100)
        pcSgstAmt = round2(toDecimal(packingCharge) * toDecimal(pcSgstRate) / 100)
    }

    const totalCgst = round2(sumCgst + pcCgstAmt)
    const totalSgst = round2(sumSgst + pcSgstAmt)
    const totalIgst = round2(sumIgst + pcIgstAmt)
    const totalGstTax = round2(totalCgst + totalSgst + totalIgst)
    const totalAmtAfterTax = round2(totalAmtBeforeTax + totalGstTax)
    const grandTotalAmount = Math.round(totalAmtAfterTax)
    const roundOff = round2(grandTotalAmount - totalAmtAfterTax)

    return {
        TotalAmtBeforeTax: totalAmtBeforeTax,
        PCGSTAmt: pcCgstAmt,
        PSGSTAmt: pcSgstAmt,
        PIGSTAmt: pcIgstAmt,
        CGST: totalCgst,
        SGST: totalSgst,
        IGST: totalIgst,
        TotalGSTTax: totalGstTax,
        TotalAmtAfterTax: totalAmtAfterTax,
        GrandTotalAmount: grandTotalAmount,
        RoundOff: roundOff,
    }
}

// ── Helper: Determine if invoice is IGST ───────────────────────────
function isIGSTInvoice(invoiceType: string): boolean {
    return invoiceType.includes('IGST')
}

// ── Helper: Determine if invoice is SEZ or Export ──────────────────
function isSEZorExport(invoiceType: string): boolean {
    return invoiceType.includes('SEZ') || invoiceType.includes('Export')
}

// ── Fields that should never be sent to INSERT (auto-generated by DB) ──
const AUTO_GENERATED_FIELDS = new Set([
    'InvoiceID', 'CreatedAt', 'UpdatedAt', 'CreatedBy', 'ModifiedBy',
])

// ── Fields the user is allowed to set on INSERT ─────────────────────
const INSERTABLE_FIELDS = new Set([
    'InvoiceNo', 'InvoiceDate', 'PartyID', 'ChallanNo', 'ChallanDate',
    'PartyDCNo', 'PartyDCDate', 'PO', 'PODate', 'ARNNo', 'ARNDate',
    'TransportationMode', 'SupplyTo', 'SupplyStateCode', 'ModelNo', 'AgainstForm',
    'ReceiverName', 'ReceiverAddress', 'ReceiverGSTIN', 'ReceiverState',
    'ReceiverStateCode', 'ReceiverPanNo',
    'ConsigneeName', 'ConsigneePartyID', 'ConsigneeAddress', 'ConsigneeGSTIN',
    'ConsigneeState', 'ConsigneeStateCode', 'ConsigneePanNo',
    'IsSameAddress', 'TotalAmtBeforeTax', 'PackingCharge',
    'PCGSTRate', 'PCGSTAmt', 'PSGSTRate', 'PSGSTAmt', 'PIGSTRate', 'PIGSTAmt',
    'CGST', 'SGST', 'IGST', 'TotalGSTTax', 'TotalAmtAfterTax',
    'GSTReverseCharge', 'TotalInWords', 'TaxInWords', 'Remarks',
    'GrandTotalAmount', 'RoundOff', 'Company', 'InvoiceType',
    'TransId', 'TransName', 'TransMode', 'Distance', 'VehNo', 'VehType',
    'EwbNo', 'EwbDt', 'EwbValidTill', 'CEWBNo', 'MultiVehInfo',
    'PlaceOfDel', 'ShipPin',
    // E-Invoice fields (set by system, not user)
    'QRCode', 'IRNNo', 'AckNo', 'AckDate',
])

// ── Helper: Clean invoice payload ──────────────────────────────────
// Only includes fields that are safe to INSERT, excludes auto-generated columns
function cleanInvoicePayload(invoiceData: Record<string, unknown>): Record<string, unknown> {
    const cleanPayload: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(invoiceData)) {
        if (value === undefined) continue
        if (AUTO_GENERATED_FIELDS.has(key)) continue
        if (!INSERTABLE_FIELDS.has(key)) continue

        switch (key) {
            case 'IsSameAddress':
                cleanPayload[key] = value === null ? false : Boolean(value)
                break
            case 'TotalAmtBeforeTax': case 'PackingCharge':
            case 'PCGSTRate': case 'PCGSTAmt': case 'PSGSTRate': case 'PSGSTAmt':
            case 'PIGSTRate': case 'PIGSTAmt':
            case 'CGST': case 'SGST': case 'IGST': case 'TotalGSTTax':
            case 'TotalAmtAfterTax': case 'GrandTotalAmount': case 'RoundOff':
            case 'GSTReverseCharge':
                cleanPayload[key] = toDecimal(value)
                break
            case 'PartyID': case 'SupplyStateCode': case 'ConsigneePartyID':
                cleanPayload[key] = value === null ? null : Number(value)
                break
            case 'InvoiceDate': case 'ChallanDate': case 'PartyDCDate':
            case 'PODate': case 'ARNDate':
                cleanPayload[key] = value === null || value === undefined ? null : value
                break
            default:
                cleanPayload[key] = toNullable(value)
                break
        }
    }
    return cleanPayload
}

// ── Helper: Clean line item payload ────────────────────────────────
function cleanLineItemPayload(item: Record<string, unknown>, invoiceId: number): Record<string, unknown> {
    const cleanItem: Record<string, unknown> = {}
    const decimalFields = ['Qty', 'Rate', 'Amount', 'Discount', 'DiscountVal', 'TaxableValue',
        'CGSTRate', 'CGSTAmt', 'SGSTRate', 'SGSTAmt', 'IGSTRate', 'IGSTAmt', 'TotalAmount']
    for (const [key, value] of Object.entries(item)) {
        if (value === undefined) continue
        if (decimalFields.includes(key)) {
            cleanItem[key] = toDecimal(value)
        } else {
            cleanItem[key] = toNullable(value)
        }
    }
    cleanItem['InvoiceID'] = invoiceId
    return cleanItem
}

// ═══════════════════════════════════════════════════════════════════
// INVOICE CONTROLLER
// ═══════════════════════════════════════════════════════════════════

class InvoiceController {

    // ── LIST INVOICES ──────────────────────────────────────────────
    // Matches VB.NET: OpenBarButtonItem_Click (date range filter)
    public async handleListInvoices(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const partyId = typeof req.query.partyId === 'string' ? Number(req.query.partyId) : undefined
        const invoiceType = typeof req.query.invoiceType === 'string' ? req.query.invoiceType : undefined
        const startDate = typeof req.query.startDate === 'string' ? req.query.startDate : undefined
        const endDate = typeof req.query.endDate === 'string' ? req.query.endDate : undefined

        const conditions = []
        if (company) conditions.push(eq(invoiceTable.Company, company))
        if (partyId) conditions.push(eq(invoiceTable.PartyID, partyId))
        if (invoiceType) conditions.push(eq(invoiceTable.InvoiceType, invoiceType))
        // Date range filter (VB.NET: WHERE InvoiceDate BETWEEN StartDate AND EndDate)
        if (startDate) conditions.push(gte(invoiceTable.InvoiceDate, new Date(startDate)))
        if (endDate) conditions.push(lte(invoiceTable.InvoiceDate, new Date(endDate)))

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const invoices = await db.select().from(invoiceTable).where(whereClause).orderBy(desc(invoiceTable.InvoiceDate))
        return res.json({ data: invoices })
    }

    // ── GET SINGLE INVOICE ─────────────────────────────────────────
    public async handleGetInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid invoice id' })

        const [invoice] = await db.select().from(invoiceTable).where(eq(invoiceTable.InvoiceID, id))
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' })

        const lineItems = await db.select().from(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
        return res.json({ data: { ...invoice, lineItems } })
    }

    // ── CREATE INVOICE ─────────────────────────────────────────────
    // Matches VB.NET: SaveSimpleButton_Click + AddNew + GenerateNo + Calc
    public async handleCreateInvoice(req: Request, res: Response) {
        const result = await createInvoicePayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })

        const { lineItems, ...invoiceData } = result.data as any

        // ── Duplicate Invoice No check (VB.NET: InvoiceNoTextEdit_Validating) ──
        if (invoiceData.InvoiceNo) {
            const [existing] = await db
                .select({ InvoiceID: invoiceTable.InvoiceID })
                .from(invoiceTable)
                .where(eq(invoiceTable.InvoiceNo, invoiceData.InvoiceNo))
                .limit(1)
            if (existing) {
                return res.status(409).json({ message: 'Value Exist! Enter Unique Value.', field: 'InvoiceNo' })
            }
        }

        // ── Duplicate Challan No check (VB.NET: ChallanNoTextEdit_Validating) ──
        if (invoiceData.ChallanNo) {
            const [existing] = await db
                .select({ InvoiceID: invoiceTable.InvoiceID })
                .from(invoiceTable)
                .where(eq(invoiceTable.ChallanNo, invoiceData.ChallanNo))
                .limit(1)
            if (existing) {
                return res.status(409).json({ message: 'Value Exist! Enter Unique Value.', field: 'ChallanNo' })
            }
        }

        // ── Determine tax type ─────────────────────────────────────
        const invoiceType = invoiceData.InvoiceType || 'Sales Invoice'
        const isIGST = isIGSTInvoice(invoiceType)
        const isSEZExp = isSEZorExport(invoiceType)

        // ── Calculate line items ───────────────────────────────────
        let calculatedLineItems: any[] = []
        if (lineItems && lineItems.length > 0) {
            calculatedLineItems = lineItems.map((item: any) => calculateLineItem(item, isIGST, isSEZExp))
        }

        // ── Calculate header totals ────────────────────────────────
        const packingCharge = toDecimal(invoiceData.PackingCharge)
        const headerTotals = calculateHeaderTotals(
            calculatedLineItems,
            packingCharge,
            toDecimal(invoiceData.PCGSTRate),
            toDecimal(invoiceData.PSGSTRate),
            toDecimal(invoiceData.PIGSTRate),
            isIGST,
            isSEZExp,
        )

        // ── Build clean payload ────────────────────────────────────
        const cleanPayload = cleanInvoicePayload({
            ...invoiceData,
            ...headerTotals,
        })

        // ── Insert header ──────────────────────────────────────────
        const [created] = await db.insert(invoiceTable).values(cleanPayload as any).returning()
        if (!created) return res.status(500).json({ message: 'Failed to create invoice' })

        // ── Insert line items ──────────────────────────────────────
        if (calculatedLineItems.length > 0) {
            const itemsWithInvoiceId = calculatedLineItems.map((item: any) =>
                cleanLineItemPayload(item, (created as any).InvoiceID)
            )
            await db.insert(invoiceDetailTable).values(itemsWithInvoiceId as any)
        }

        // ── Increment invoice counter (VB.NET: SaveSimpleButton_Click) ──
        if (invoiceData.Company) {
            const [company] = await db.select().from(companyTable).where(eq(companyTable.Name, invoiceData.Company)).limit(1)
            if (company) {
                const fy = (company as any).FinancialYear
                const { count } = await generateInvoiceNumber(invoiceData.Company, invoiceType)
                await incrementInvoiceCounter((company as any).CompanyID, fy, invoiceType, count)
            }
        }

        return res.status(201).json({ message: 'Invoice created', data: created })
    }

    // ── UPDATE INVOICE ─────────────────────────────────────────────
    // Matches VB.NET: SaveSimpleButton_Click (edit mode)
    public async handleUpdateInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid invoice id' })

        const result = await updateInvoicePayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })

        const { lineItems, ...invoiceData } = result.data as any

        // ── Check invoice exists ───────────────────────────────────
        const [existing] = await db.select().from(invoiceTable).where(eq(invoiceTable.InvoiceID, id))
        if (!existing) return res.status(404).json({ message: 'Invoice not found' })

        // ── Duplicate Invoice No check (exclude current) ───────────
        if (invoiceData.InvoiceNo) {
            const [dup] = await db
                .select({ InvoiceID: invoiceTable.InvoiceID })
                .from(invoiceTable)
                .where(and(eq(invoiceTable.InvoiceNo, invoiceData.InvoiceNo), ne(invoiceTable.InvoiceID, id)))
                .limit(1)
            if (dup) {
                return res.status(409).json({ message: 'Value Exist! Enter Unique Value.', field: 'InvoiceNo' })
            }
        }

        // ── Determine tax type ─────────────────────────────────────
        const invoiceType = invoiceData.InvoiceType || (existing as any).InvoiceType || 'Sales Invoice'
        const isIGST = isIGSTInvoice(invoiceType)
        const isSEZExp = isSEZorExport(invoiceType)

        // ── Calculate line items ───────────────────────────────────
        let calculatedLineItems: any[] = []
        if (lineItems && lineItems.length > 0) {
            calculatedLineItems = lineItems.map((item: any) => calculateLineItem(item, isIGST, isSEZExp))
        }

        // ── Calculate header totals ────────────────────────────────
        const packingCharge = toDecimal(invoiceData.PackingCharge ?? (existing as any).PackingCharge)
        const headerTotals = calculateHeaderTotals(
            calculatedLineItems,
            packingCharge,
            toDecimal(invoiceData.PCGSTRate ?? (existing as any).PCGSTRate),
            toDecimal(invoiceData.PSGSTRate ?? (existing as any).PSGSTRate),
            toDecimal(invoiceData.PIGSTRate ?? (existing as any).PIGSTRate),
            isIGST,
            isSEZExp,
        )

        // ── Build clean payload ────────────────────────────────────
        const cleanPayload = cleanInvoicePayload({
            ...invoiceData,
            ...headerTotals,
        })

        // ── Update header ──────────────────────────────────────────
        const [updated] = await db.update(invoiceTable).set(cleanPayload as any).where(eq(invoiceTable.InvoiceID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Invoice not found' })

        // ── Replace line items ─────────────────────────────────────
        if (lineItems) {
            await db.delete(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
            if (calculatedLineItems.length > 0) {
                const itemsWithInvoiceId = calculatedLineItems.map((item: any) =>
                    cleanLineItemPayload(item, id)
                )
                await db.insert(invoiceDetailTable).values(itemsWithInvoiceId as any)
            }
        }

        return res.json({ message: 'Invoice updated', data: updated })
    }

    // ── DELETE INVOICE ─────────────────────────────────────────────
    // Matches VB.NET: DeleteBarButtonItem_Click (cascade delete)
    public async handleDeleteInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid invoice id' })

        const [existing] = await db.select().from(invoiceTable).where(eq(invoiceTable.InvoiceID, id))
        if (!existing) return res.status(404).json({ message: 'Invoice not found' })

        // Delete line items first (cascade)
        await db.delete(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
        // Delete header
        await db.delete(invoiceTable).where(eq(invoiceTable.InvoiceID, id))

        return res.json({ message: 'Invoice deleted' })
    }

    // ── GENERATE INVOICE NUMBER ────────────────────────────────────
    // Matches VB.NET: GenerateNo() — called by frontend for preview
    public async handleGenerateInvoiceNo(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const invoiceType = typeof req.query.invoiceType === 'string' ? req.query.invoiceType : 'Sales Invoice'

        if (!company) return res.status(400).json({ message: 'Company is required' })

        try {
            const { invoiceNo } = await generateInvoiceNumber(company, invoiceType)
            return res.json({ data: { InvoiceNo: invoiceNo } })
        } catch (err: any) {
            return res.status(500).json({ message: err.message || 'Failed to generate invoice number' })
        }
    }

    // ── GET PARTY DETAILS (for auto-fill) ──────────────────────────
    // Matches VB.NET: ReceiverNameComboBoxEdit_SelectedIndexChanged
    public async handleGetPartyDetails(req: Request, res: Response) {
        const partyId = Number(req.query.partyId)
        if (Number.isNaN(partyId)) return res.status(400).json({ message: 'Invalid party id' })

        const [party] = await db.select().from(partyTable).where(eq(partyTable.PartyID, partyId))
        if (!party) return res.status(404).json({ message: 'Party not found' })

        return res.json({ data: party })
    }

    // ── GET PRODUCT DETAILS (for auto-fill) ────────────────────────
    // Matches VB.NET: InvoiceDetailGridView_CellValueChanged (ProductName change)
    public async handleGetProductDetails(req: Request, res: Response) {
        const productId = Number(req.query.productId)
        if (Number.isNaN(productId)) return res.status(400).json({ message: 'Invalid product id' })

        const [product] = await db.select().from(productTable).where(eq(productTable.ProductID, productId))
        if (!product) return res.status(404).json({ message: 'Product not found' })

        return res.json({ data: product })
    }

    // ── LIST PARTIES FOR DROPDOWN ──────────────────────────────────
    // Matches VB.NET: InitLookup() — filtered by state code for intra/inter state
    public async handleListParties(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const stateCode = typeof req.query.stateCode === 'string' ? req.query.stateCode : undefined
        const isInterState = req.query.isInterState === 'true'

        const conditions = []
        if (company) conditions.push(eq(partyTable.Company, company))

        // For intra-state: filter by company's state code
        // For inter-state: exclude company's state code
        if (stateCode && !isInterState) {
            conditions.push(eq(partyTable.StateCode, Number(stateCode)))
        } else if (stateCode && isInterState) {
            conditions.push(ne(partyTable.StateCode, Number(stateCode)))
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const parties = await db.select().from(partyTable).where(whereClause)
        return res.json({ data: parties })
    }

    // ── LIST PRODUCTS FOR DROPDOWN ─────────────────────────────────
    public async handleListProducts(req: Request, res: Response) {
        const products = await db.select().from(productTable)
        return res.json({ data: products })
    }

    // ═══════════════════════════════════════════════════════════════
    // SERVICE INVOICE CONTROLLER METHODS
    // ═══════════════════════════════════════════════════════════════

    public async handleListServiceInvoices(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = []
        if (company) conditions.push(eq(serviceInvoiceTable.Company, company))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const invoices = await db.select().from(serviceInvoiceTable).where(whereClause).orderBy(desc(serviceInvoiceTable.InvoiceDate))
        return res.json({ data: invoices })
    }

    public async handleGetServiceInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid service invoice id' })
        const [invoice] = await db.select().from(serviceInvoiceTable).where(eq(serviceInvoiceTable.ServiceInvoiceID, id))
        if (!invoice) return res.status(404).json({ message: 'Service invoice not found' })
        // Note: serviceInvoiceDetailTable would need to be imported for line items
        return res.json({ data: invoice })
    }

    // ═══════════════════════════════════════════════════════════════
    // PROFORMA INVOICE CONTROLLER METHODS
    // ═══════════════════════════════════════════════════════════════

    public async handleListProformaInvoices(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = []
        if (company) conditions.push(eq(proformaInvoiceTable.Company, company))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const invoices = await db.select().from(proformaInvoiceTable).where(whereClause).orderBy(desc(proformaInvoiceTable.InvoiceDate))
        return res.json({ data: invoices })
    }

    public async handleGetProformaInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid proforma invoice id' })
        const [invoice] = await db.select().from(proformaInvoiceTable).where(eq(proformaInvoiceTable.ProformaInvoiceID, id))
        if (!invoice) return res.status(404).json({ message: 'Proforma invoice not found' })
        return res.json({ data: invoice })
    }
}

export default InvoiceController
