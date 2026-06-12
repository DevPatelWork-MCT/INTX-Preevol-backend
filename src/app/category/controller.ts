import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { categoryTable, subCategoryTable } from '../../db/schema.js'
import { createCategoryPayloadModel, updateCategoryPayloadModel, createSubCategoryPayloadModel, updateSubCategoryPayloadModel } from './models.js'

class CategoryController {
    // ── Categories ───────────────────────────────────────────────
    public async handleListCategories(req: Request, res: Response) {
        const companyId = typeof req.query.companyId === 'string' ? Number(req.query.companyId) : undefined
        const conditions = []
        if (companyId) conditions.push(eq(categoryTable.CompanyID, companyId))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const categories = await db.select().from(categoryTable).where(whereClause)
        return res.json({ data: categories })
    }

    public async handleGetCategory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid category id' })
        const [category] = await db.select().from(categoryTable).where(eq(categoryTable.CategoryID, id))
        if (!category) return res.status(404).json({ message: 'Category not found' })
        return res.json({ data: category })
    }

    public async handleCreateCategory(req: Request, res: Response) {
        const result = await createCategoryPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [created] = await db.insert(categoryTable).values(result.data).returning()
        return res.status(201).json({ message: 'Category created', data: created })
    }

    public async handleUpdateCategory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid category id' })
        const result = await updateCategoryPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [updated] = await db.update(categoryTable).set(result.data).where(eq(categoryTable.CategoryID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Category not found' })
        return res.json({ message: 'Category updated', data: updated })
    }

    public async handleDeleteCategory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid category id' })
        const [existing] = await db.select().from(categoryTable).where(eq(categoryTable.CategoryID, id))
        if (!existing) return res.status(404).json({ message: 'Category not found' })
        await db.delete(categoryTable).where(eq(categoryTable.CategoryID, id))
        return res.json({ message: 'Category deleted' })
    }

    // ── Sub Categories ───────────────────────────────────────────
    public async handleListSubCategories(req: Request, res: Response) {
        const categoryId = typeof req.query.categoryId === 'string' ? Number(req.query.categoryId) : undefined
        const conditions = []
        if (categoryId) conditions.push(eq(subCategoryTable.CategoryID, categoryId))
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined
        const subCategories = await db.select().from(subCategoryTable).where(whereClause)
        return res.json({ data: subCategories })
    }

    public async handleGetSubCategory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid sub category id' })
        const [subCategory] = await db.select().from(subCategoryTable).where(eq(subCategoryTable.SubCategoryID, id))
        if (!subCategory) return res.status(404).json({ message: 'Sub Category not found' })
        return res.json({ data: subCategory })
    }

    public async handleCreateSubCategory(req: Request, res: Response) {
        const result = await createSubCategoryPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [created] = await db.insert(subCategoryTable).values(result.data).returning()
        return res.status(201).json({ message: 'Sub Category created', data: created })
    }

    public async handleUpdateSubCategory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid sub category id' })
        const result = await updateSubCategoryPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })
        const [updated] = await db.update(subCategoryTable).set(result.data).where(eq(subCategoryTable.SubCategoryID, id)).returning()
        if (!updated) return res.status(404).json({ message: 'Sub Category not found' })
        return res.json({ message: 'Sub Category updated', data: updated })
    }

    public async handleDeleteSubCategory(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid sub category id' })
        const [existing] = await db.select().from(subCategoryTable).where(eq(subCategoryTable.SubCategoryID, id))
        if (!existing) return res.status(404).json({ message: 'Sub Category not found' })
        await db.delete(subCategoryTable).where(eq(subCategoryTable.SubCategoryID, id))
        return res.json({ message: 'Sub Category deleted' })
    }
}

export default CategoryController
