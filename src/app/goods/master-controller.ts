import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { typeTable, modelTable, plungerDiaTable, mocTable, stockCategoryTable, stockSubCategoryTable, stockProductTable } from '../../db/schema.js'

// ── Type ─────────────────────────────────────────────────────────
export async function handleListTypes(_req: Request, res: Response) {
    const types = await db.select().from(typeTable)
    return res.json({ data: types })
}
export async function handleCreateType(req: Request, res: Response) {
    const [created] = await db.insert(typeTable).values({ TypeName: req.body.TypeName }).returning()
    return res.status(201).json({ data: created })
}
export async function handleUpdateType(req: Request, res: Response) {
    const id = Number(req.params.id)
    const [updated] = await db.update(typeTable).set({ TypeName: req.body.TypeName }).where(eq(typeTable.TypeID, id)).returning()
    return res.json({ data: updated })
}
export async function handleDeleteType(req: Request, res: Response) {
    const id = Number(req.params.id)
    await db.delete(typeTable).where(eq(typeTable.TypeID, id))
    return res.json({ message: "Deleted" })
}

// ── Model ────────────────────────────────────────────────────────
export async function handleListModels(_req: Request, res: Response) {
    const models = await db.select().from(modelTable)
    return res.json({ data: models })
}
export async function handleCreateModel(req: Request, res: Response) {
    const [created] = await db.insert(modelTable).values({ ModelName: req.body.ModelName }).returning()
    return res.status(201).json({ data: created })
}
export async function handleUpdateModel(req: Request, res: Response) {
    const id = Number(req.params.id)
    const [updated] = await db.update(modelTable).set({ ModelName: req.body.ModelName }).where(eq(modelTable.ModelID, id)).returning()
    return res.json({ data: updated })
}
export async function handleDeleteModel(req: Request, res: Response) {
    const id = Number(req.params.id)
    await db.delete(modelTable).where(eq(modelTable.ModelID, id))
    return res.json({ message: "Deleted" })
}

// ── Plunger Diameter ─────────────────────────────────────────────
export async function handleListPlungerDiameters(_req: Request, res: Response) {
    const items = await db.select().from(plungerDiaTable)
    return res.json({ data: items })
}
export async function handleCreatePlungerDiameter(req: Request, res: Response) {
    const [created] = await db.insert(plungerDiaTable).values({ PlungerDiaName: req.body.PlungerDiaName }).returning()
    return res.status(201).json({ data: created })
}
export async function handleUpdatePlungerDiameter(req: Request, res: Response) {
    const id = Number(req.params.id)
    const [updated] = await db.update(plungerDiaTable).set({ PlungerDiaName: req.body.PlungerDiaName }).where(eq(plungerDiaTable.PlungerDiaID, id)).returning()
    return res.json({ data: updated })
}
export async function handleDeletePlungerDiameter(req: Request, res: Response) {
    const id = Number(req.params.id)
    await db.delete(plungerDiaTable).where(eq(plungerDiaTable.PlungerDiaID, id))
    return res.json({ message: "Deleted" })
}

// ── MOC ──────────────────────────────────────────────────────────
export async function handleListMOCs(_req: Request, res: Response) {
    const items = await db.select().from(mocTable)
    return res.json({ data: items })
}
export async function handleCreateMOC(req: Request, res: Response) {
    const [created] = await db.insert(mocTable).values({ MOCName: req.body.MOCName }).returning()
    return res.status(201).json({ data: created })
}
export async function handleUpdateMOC(req: Request, res: Response) {
    const id = Number(req.params.id)
    const [updated] = await db.update(mocTable).set({ MOCName: req.body.MOCName }).where(eq(mocTable.MOCID, id)).returning()
    return res.json({ data: updated })
}
export async function handleDeleteMOC(req: Request, res: Response) {
    const id = Number(req.params.id)
    await db.delete(mocTable).where(eq(mocTable.MOCID, id))
    return res.json({ message: "Deleted" })
}

// ── Stock Category ───────────────────────────────────────────────
export async function handleListStockCategories(_req: Request, res: Response) {
    const items = await db.select().from(stockCategoryTable)
    return res.json({ data: items })
}
export async function handleCreateStockCategory(req: Request, res: Response) {
    const [created] = await db.insert(stockCategoryTable).values({ StockCategoryName: req.body.StockCategoryName }).returning()
    return res.status(201).json({ data: created })
}
export async function handleUpdateStockCategory(req: Request, res: Response) {
    const id = Number(req.params.id)
    const [updated] = await db.update(stockCategoryTable).set({ StockCategoryName: req.body.StockCategoryName }).where(eq(stockCategoryTable.StockCategoryID, id)).returning()
    return res.json({ data: updated })
}
export async function handleDeleteStockCategory(req: Request, res: Response) {
    const id = Number(req.params.id)
    await db.delete(stockCategoryTable).where(eq(stockCategoryTable.StockCategoryID, id))
    return res.json({ message: "Deleted" })
}

// ── Stock Sub Category ───────────────────────────────────────────
export async function handleListStockSubCategories(req: Request, res: Response) {
    const items = await db.select().from(stockSubCategoryTable)
    return res.json({ data: items })
}
export async function handleCreateStockSubCategory(req: Request, res: Response) {
    const [created] = await db.insert(stockSubCategoryTable).values({ StockCategoryID: req.body.StockCategoryID, StockSubCategoryName: req.body.StockSubCategoryName }).returning()
    return res.status(201).json({ data: created })
}
export async function handleUpdateStockSubCategory(req: Request, res: Response) {
    const id = Number(req.params.id)
    const [updated] = await db.update(stockSubCategoryTable).set({ StockSubCategoryName: req.body.StockSubCategoryName }).where(eq(stockSubCategoryTable.StockSubCategoryID, id)).returning()
    return res.json({ data: updated })
}
export async function handleDeleteStockSubCategory(req: Request, res: Response) {
    const id = Number(req.params.id)
    await db.delete(stockSubCategoryTable).where(eq(stockSubCategoryTable.StockSubCategoryID, id))
    return res.json({ message: "Deleted" })
}

// ── Stock Product ────────────────────────────────────────────────
export async function handleListStockProducts(_req: Request, res: Response) {
    const items = await db.select().from(stockProductTable)
    return res.json({ data: items })
}
export async function handleCreateStockProduct(req: Request, res: Response) {
    const [created] = await db.insert(stockProductTable).values(req.body).returning()
    return res.status(201).json({ data: created })
}
export async function handleUpdateStockProduct(req: Request, res: Response) {
    const id = Number(req.params.id)
    const [updated] = await db.update(stockProductTable).set(req.body).where(eq(stockProductTable.StockProductID, id)).returning()
    return res.json({ data: updated })
}
export async function handleDeleteStockProduct(req: Request, res: Response) {
    const id = Number(req.params.id)
    await db.delete(stockProductTable).where(eq(stockProductTable.StockProductID, id))
    return res.json({ message: "Deleted" })
}
