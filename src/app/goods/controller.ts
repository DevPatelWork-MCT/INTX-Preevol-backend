import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { goodsTable, goodsInventoryTable } from '../../db/schema.js'
import { createGoodsPayloadModel, updateGoodsPayloadModel, createInventoryPayloadModel, updateInventoryPayloadModel } from './models.js'

class GoodsController {
    // ── Goods ────────────────────────────────────────────────────
    public async handleListGoods(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = []
        if (company) conditions.push(eq(goodsTable.Company, company))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const goods = await db.select().from(goodsTable).where(whereClause)
        return res.json({ data: goods })
    }

    public async handleGetGood(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid goods id' })
        const [good] = await db.select().from(goodsTable).where(eq(goodsTable.GoodsID, id))
        if (!good) return res.status(404).json({ message: 'Goods not found' })
        return res.json({ data: good })
    }

    public async handleCreateGood(req: Request, res: Response) {
        const result = await createGoodsPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [created] = await db.insert(goodsTable).values(result.data).returning()
        return res.status(201).json({ message: 'Goods created', data: created })
    }

    public async handleUpdateGood(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid goods id' })
        const result = await updateGoodsPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [updated] = await db.update(goodsTable).set(result.data).where(eq(goodsTable.GoodsID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Goods not found' })
        return res.json({ message: 'Goods updated', data: updated })
    }

    public async handleDeleteGood(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid goods id' })
        const [existing] = await db.select().from(goodsTable).where(eq(goodsTable.GoodsID, id))
        if (!existing) return res.status(404).json({ message: 'Goods not found' })
        await db.delete(goodsTable).where(eq(goodsTable.GoodsID, id))
        return res.json({ message: 'Goods deleted' })
    }

    // ── Inventory ────────────────────────────────────────────────
    public async handleListInventory(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const goodsId = typeof req.query.goodsId === 'string' ? Number(req.query.goodsId) : undefined
        const conditions = []
        if (company) conditions.push(eq(goodsInventoryTable.Company, company))
        if (goodsId) conditions.push(eq(goodsInventoryTable.GoodsID, goodsId))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const inventory = await db.select().from(goodsInventoryTable).where(whereClause)
        return res.json({ data: inventory })
    }

    public async handleGetInventory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid inventory id' })
        const [item] = await db.select().from(goodsInventoryTable).where(eq(goodsInventoryTable.InventoryID, id))
        if (!item) return res.status(404).json({ message: 'Inventory record not found' })
        return res.json({ data: item })
    }

    public async handleCreateInventory(req: Request, res: Response) {
        const result = await createInventoryPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [created] = await db.insert(goodsInventoryTable).values(result.data).returning()
        return res.status(201).json({ message: 'Inventory record created', data: created })
    }

    public async handleUpdateInventory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid inventory id' })
        const result = await updateInventoryPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [updated] = await db.update(goodsInventoryTable).set(result.data).where(eq(goodsInventoryTable.InventoryID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Inventory record not found' })
        return res.json({ message: 'Inventory record updated', data: updated })
    }

    public async handleDeleteInventory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid inventory id' })
        const [existing] = await db.select().from(goodsInventoryTable).where(eq(goodsInventoryTable.InventoryID, id))
        if (!existing) return res.status(404).json({ message: 'Inventory record not found' })
        await db.delete(goodsInventoryTable).where(eq(goodsInventoryTable.InventoryID, id))
        return res.json({ message: 'Inventory record deleted' })
    }
}

export default GoodsController
