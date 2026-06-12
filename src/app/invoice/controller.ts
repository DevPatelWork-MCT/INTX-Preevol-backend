import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { invoiceTable, invoiceDetailTable } from '../../db/schema.js'
import { createInvoicePayloadModel, updateInvoicePayloadModel } from './models.js'

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
        // Fetch line items
        const lineItems = await db.select().from(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
        return res.json({ data: { ...invoice, lineItems } })
    }

    public async handleCreateInvoice(req: Request, res: Response) {
        const result = await createInvoicePayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })

        const { lineItems, ...invoiceData } = result.data

        const [created] = await db.insert(invoiceTable).values(invoiceData).returning()
        if (!created) return res.status(500).json({ message: 'Failed to create invoice' })

        // Insert line items if provided
        if (lineItems && lineItems.length > 0) {
            const itemsWithInvoiceId = lineItems.map((item: any) => ({
                ...item,
                InvoiceID: created.InvoiceID,
            }))
            await db.insert(invoiceDetailTable).values(itemsWithInvoiceId)
        }

        return res.status(201).json({ message: 'Invoice created', data: created })
    }

    public async handleUpdateInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid invoice id' })
        const result = await updateInvoicePayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })

        const { lineItems, ...invoiceData } = result.data

        const [updated] = await db.update(invoiceTable).set(invoiceData).where(eq(invoiceTable.InvoiceID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Invoice not found' })

        // Update line items if provided
        if (lineItems) {
            // Delete existing line items and re-insert
            await db.delete(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
            if (lineItems.length > 0) {
                const itemsWithInvoiceId = lineItems.map((item: any) => ({
                    ...item,
                    InvoiceID: id,
                }))
                await db.insert(invoiceDetailTable).values(itemsWithInvoiceId)
            }
        }

        return res.json({ message: 'Invoice updated', data: updated })
    }

    public async handleDeleteInvoice(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid invoice id' })
        const [existing] = await db.select().from(invoiceTable).where(eq(invoiceTable.InvoiceID, id))
        if (!existing) return res.status(404).json({ message: 'Invoice not found' })
        // Delete line items first
        await db.delete(invoiceDetailTable).where(eq(invoiceDetailTable.InvoiceID, id))
        await db.delete(invoiceTable).where(eq(invoiceTable.InvoiceID, id))
        return res.json({ message: 'Invoice deleted' })
    }
}

export default InvoiceController
