import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { purchaseOrderTable } from '../../db/schema.js'
import { createPurchaseOrderPayloadModel, updatePurchaseOrderPayloadModel } from './models.js'

class PurchaseOrderController {
    public async handleListPurchaseOrders(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const vendorId = typeof req.query.vendorId === 'string' ? Number(req.query.vendorId) : undefined
        const conditions = []
        if (company) conditions.push(eq(purchaseOrderTable.Company, company))
        if (vendorId) conditions.push(eq(purchaseOrderTable.VendorID, vendorId))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const orders = await db.select().from(purchaseOrderTable).where(whereClause)
        return res.json({ data: orders })
    }

    public async handleGetPurchaseOrder(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid purchase order id' })
        const [order] = await db.select().from(purchaseOrderTable).where(eq(purchaseOrderTable.PurchaseOrderID, id))
        if (!order) return res.status(404).json({ message: 'Purchase Order not found' })
        return res.json({ data: order })
    }

    public async handleCreatePurchaseOrder(req: Request, res: Response) {
        const result = await createPurchaseOrderPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const { lineItems, ...orderData } = result.data
        const [created] = await db.insert(purchaseOrderTable).values(orderData).returning()
        return res.status(201).json({ message: 'Purchase Order created', data: created })
    }

    public async handleUpdatePurchaseOrder(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid purchase order id' })
        const result = await updatePurchaseOrderPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const { lineItems, ...orderData } = result.data
        const [updated] = await db.update(purchaseOrderTable).set(orderData).where(eq(purchaseOrderTable.PurchaseOrderID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Purchase Order not found' })
        return res.json({ message: 'Purchase Order updated', data: updated })
    }

    public async handleDeletePurchaseOrder(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid purchase order id' })
        const [existing] = await db.select().from(purchaseOrderTable).where(eq(purchaseOrderTable.PurchaseOrderID, id))
        if (!existing) return res.status(404).json({ message: 'Purchase Order not found' })
        await db.delete(purchaseOrderTable).where(eq(purchaseOrderTable.PurchaseOrderID, id))
        return res.json({ message: 'Purchase Order deleted' })
    }
}

export default PurchaseOrderController
