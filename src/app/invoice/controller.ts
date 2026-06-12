import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { invoiceTable, invoiceDetailTable } from '../../db/schema.js'
import { createInvoicePayloadModel, updateInvoicePayloadModel } from './models.js'

/** Convert empty strings / undefined / null to null, pass through everything else */
const toNullable = (value: unknown): unknown => {
    if (value === '' || value === undefined || value === null) return null
    return value
}

/** Convert a boolean or string to a decimal-compatible number for the DB */
const toDecimal = (value: unknown): number => {
    if (value === '' || value === undefined || value === null) return 0
    if (typeof value === 'boolean') return value ? 1 : 0
    const num = Number(value)
    return isNaN(num) ? 0 : num
}

class InvoiceController {
    public async handleListInvoices(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const partyId = typeof req.query.partyId === 'string' ? Number(req.query.partyId) : undefined
        const invoiceType = typeof req.query.invoiceType === 'string' ? req.query.invoiceType : undefined
        const conditions = []
        if (company) conditions.push(eq(invoiceTable.Company, company))
        if (partyId) conditions.push(eq(invoiceTable.PartyID, partyId))
        if (invoiceType) conditions.push(eq(invoiceTable.InvoiceType, invoiceType))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const invoices = await db.select().from(invoiceTable).where(whereClause)
        return res.json({ data: invoices })
    }

    public async handleGetInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid invoice id' })
        const [invoice] = await db.select().from(invoiceTable).where(eq(invoiceTable.InvoiceID, id))
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' })
        const lineItems = await db.select().from(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
        return res.json({ data: { ...invoice, lineItems } })
    }

    public async handleCreateInvoice(req: Request, res: Response) {
        const result = await createInvoicePayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })

        const { lineItems, ...invoiceData } = result.data

        // Build a clean payload with proper null handling and type normalization
        const cleanPayload: Record<string, unknown> = {}

        for (const [key, value] of Object.entries(invoiceData)) {
            if (value === undefined) continue

            switch (key) {
                // Boolean fields
                case 'IsSameAddress':
                    cleanPayload[key] = value === null ? false : Boolean(value)
                    break

                // Decimal / numeric fields — ensure numbers, default 0
                case 'TotalAmtBeforeTax':
                case 'PackingCharge':
                case 'PCGSTRate':
                case 'PCGSTAmt':
                case 'PSGSTRate':
                case 'PSGSTAmt':
                case 'PIGSTRate':
                case 'PIGSTAmt':
                case 'CGST':
                case 'SGST':
                case 'IGST':
                case 'TotalGSTTax':
                case 'TotalAmtAfterTax':
                case 'GrandTotalAmount':
                case 'RoundOff':
                case 'GSTReverseCharge':
                    cleanPayload[key] = toDecimal(value)
                    break

                // Integer fields
                case 'PartyID':
                case 'SupplyStateCode':
                case 'ConsigneePartyID':
                    cleanPayload[key] = value === null ? null : Number(value)
                    break

                // Date fields — pass through (already coerced by Zod to Date or null)
                case 'InvoiceDate':
                case 'ChallanDate':
                case 'PartyDCDate':
                case 'PODate':
                case 'ARNDate':
                    cleanPayload[key] = value === null || value === undefined ? null : value
                    break

                // All other string/varchar fields — convert empty strings to null
                default:
                    cleanPayload[key] = toNullable(value)
                    break
            }
        }

        const [created] = await db.insert(invoiceTable).values(cleanPayload as any).returning()
        if (!created) return res.status(500).json({ message: 'Failed to create invoice' })

        // Insert line items if provided
        if (lineItems && lineItems.length > 0) {
            const itemsWithInvoiceId = lineItems.map((item: any) => {
                const cleanItem: Record<string, unknown> = {}
                for (const [key, value] of Object.entries(item)) {
                    if (value === undefined) continue
                    if (['Qty', 'Rate', 'Amount', 'Discount', 'DiscountVal', 'TaxableValue',
                         'CGSTRate', 'CGSTAmt', 'SGSTRate', 'SGSTAmt', 'IGSTRate', 'IGSTAmt', 'TotalAmount'].includes(key)) {
                        cleanItem[key] = toDecimal(value)
                    } else {
                        cleanItem[key] = toNullable(value)
                    }
                }
                cleanItem['InvoiceID'] = created.InvoiceID
                return cleanItem
            })
            await db.insert(invoiceDetailTable).values(itemsWithInvoiceId as any)
        }

        return res.status(201).json({ message: 'Invoice created', data: created })
    }

    public async handleUpdateInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid invoice id' })
        const result = await updateInvoicePayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })

        const { lineItems, ...invoiceData } = result.data

        const cleanPayload: Record<string, unknown> = {}

        for (const [key, value] of Object.entries(invoiceData)) {
            if (value === undefined) continue

            switch (key) {
                case 'IsSameAddress':
                    cleanPayload[key] = value === null ? false : Boolean(value)
                    break
                case 'TotalAmtBeforeTax':
                case 'PackingCharge':
                case 'PCGSTRate':
                case 'PCGSTAmt':
                case 'PSGSTRate':
                case 'PSGSTAmt':
                case 'PIGSTRate':
                case 'PIGSTRate':
                case 'PIGSTAmt':
                case 'CGST':
                case 'SGST':
                case 'IGST':
                case 'TotalGSTTax':
                case 'TotalAmtAfterTax':
                case 'GrandTotalAmount':
                case 'RoundOff':
                case 'GSTReverseCharge':
                    cleanPayload[key] = toDecimal(value)
                    break
                case 'PartyID':
                case 'SupplyStateCode':
                case 'ConsigneePartyID':
                    cleanPayload[key] = value === null ? null : Number(value)
                    break
                case 'InvoiceDate':
                case 'ChallanDate':
                case 'PartyDCDate':
                case 'PODate':
                case 'ARNDate':
                    cleanPayload[key] = value === null || value === undefined ? null : value
                    break
                default:
                    cleanPayload[key] = toNullable(value)
                    break
            }
        }

        const [updated] = await db.update(invoiceTable).set(cleanPayload as any).where(eq(invoiceTable.InvoiceID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Invoice not found' })

        if (lineItems) {
            await db.delete(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
            if (lineItems.length > 0) {
                const itemsWithInvoiceId = lineItems.map((item: any) => {
                    const cleanItem: Record<string, unknown> = {}
                    for (const [key, value] of Object.entries(item)) {
                        if (value === undefined) continue
                        if (['Qty', 'Rate', 'Amount', 'Discount', 'DiscountVal', 'TaxableValue',
                             'CGSTRate', 'CGSTAmt', 'SGSTRate', 'SGSTAmt', 'IGSTRate', 'IGSTAmt', 'TotalAmount'].includes(key)) {
                            cleanItem[key] = toDecimal(value)
                        } else {
                            cleanItem[key] = toNullable(value)
                        }
                    }
                    cleanItem['InvoiceID'] = id
                    return cleanItem
                })
                await db.insert(invoiceDetailTable).values(itemsWithInvoiceId as any)
            }
        }

        return res.json({ message: 'Invoice updated', data: updated })
    }

    public async handleDeleteInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid invoice id' })
        const [existing] = await db.select().from(invoiceTable).where(eq(invoiceTable.InvoiceID, id))
        if (!existing) return res.status(404).json({ message: 'Invoice not found' })
        await db.delete(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
        await db.delete(invoiceTable).where(eq(invoiceTable.InvoiceID, id))
        return res.json({ message: 'Invoice deleted' })
    }
}

export default InvoiceController
