import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { productTable, poProductTable } from '../../db/schema.js'
import { createProductPayloadModel, updateProductPayloadModel, createPOProductPayloadModel, updatePOProductPayloadModel } from './models.js'

class ProductController {
    // ── Products ─────────────────────────────────────────────────
    public async handleListProducts(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const categoryId = typeof req.query.categoryId === 'string' ? Number(req.query.categoryId) : undefined
        const conditions = []
        if (company) conditions.push(eq(productTable.Company, company))
        if (categoryId) conditions.push(eq(productTable.CategoryID, categoryId))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const products = await db.select().from(productTable).where(whereClause)
        return res.json({ data: products })
    }

    public async handleGetProduct(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid product id' })
        const [product] = await db.select().from(productTable).where(eq(productTable.ProductID, id))
        if (!product) return res.status(404).json({ message: 'Product not found' })
        return res.json({ data: product })
    }

    public async handleCreateProduct(req: Request, res: Response) {
        const result = await createProductPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [created] = await db.insert(productTable).values(result.data).returning()
        return res.status(201).json({ message: 'Product created', data: created })
    }

    public async handleUpdateProduct(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid product id' })
        const result = await updateProductPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [updated] = await db.update(productTable).set(result.data).where(eq(productTable.ProductID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Product not found' })
        return res.json({ message: 'Product updated', data: updated })
    }

    public async handleDeleteProduct(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid product id' })
        const [existing] = await db.select().from(productTable).where(eq(productTable.ProductID, id))
        if (!existing) return res.status(404).json({ message: 'Product not found' })
        await db.delete(productTable).where(eq(productTable.ProductID, id))
        return res.json({ message: 'Product deleted' })
    }

    // ── PO Products ──────────────────────────────────────────────
    public async handleListPOProducts(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = []
        if (company) conditions.push(eq(poProductTable.Company, company))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const products = await db.select().from(poProductTable).where(whereClause)
        return res.json({ data: products })
    }

    public async handleGetPOProduct(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid PO product id' })
        const [product] = await db.select().from(poProductTable).where(eq(poProductTable.POProductID, id))
        if (!product) return res.status(404).json({ message: 'PO Product not found' })
        return res.json({ data: product })
    }

    public async handleCreatePOProduct(req: Request, res: Response) {
        const result = await createPOProductPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [created] = await db.insert(poProductTable).values(result.data).returning()
        return res.status(201).json({ message: 'PO Product created', data: created })
    }

    public async handleUpdatePOProduct(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid PO product id' })
        const result = await updatePOProductPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [updated] = await db.update(poProductTable).set(result.data).where(eq(poProductTable.POProductID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'PO Product not found' })
        return res.json({ message: 'PO Product updated', data: updated })
    }

    public async handleDeletePOProduct(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid PO product id' })
        const [existing] = await db.select().from(poProductTable).where(eq(poProductTable.POProductID, id))
        if (!existing) return res.status(404).json({ message: 'PO Product not found' })
        await db.delete(poProductTable).where(eq(poProductTable.POProductID, id))
        return res.json({ message: 'PO Product deleted' })
    }
}

export default ProductController
