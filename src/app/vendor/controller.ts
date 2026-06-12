import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { vendorTable } from '../../db/schema.js'
import { createVendorPayloadModel, updateVendorPayloadModel } from './models.js'

class VendorController {
    public async handleListVendors(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = []
        if (company) conditions.push(eq(vendorTable.Company, company))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const vendors = await db.select().from(vendorTable).where(whereClause)
        return res.json({ data: vendors })
    }

    public async handleGetVendor(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid vendor id' })
        const [vendor] = await db.select().from(vendorTable).where(eq(vendorTable.VendorID, id))
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' })
        return res.json({ data: vendor })
    }

    public async handleCreateVendor(req: Request, res: Response) {
        const result = await createVendorPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [created] = await db.insert(vendorTable).values(result.data).returning()
        return res.status(201).json({ message: 'Vendor created', data: created })
    }

    public async handleUpdateVendor(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid vendor id' })
        const result = await updateVendorPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [updated] = await db.update(vendorTable).set(result.data).where(eq(vendorTable.VendorID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Vendor not found' })
        return res.json({ message: 'Vendor updated', data: updated })
    }

    public async handleDeleteVendor(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid vendor id' })
        const [existing] = await db.select().from(vendorTable).where(eq(vendorTable.VendorID, id))
        if (!existing) return res.status(404).json({ message: 'Vendor not found' })
        await db.delete(vendorTable).where(eq(vendorTable.VendorID, id))
        return res.json({ message: 'Vendor deleted' })
    }
}

export default VendorController
