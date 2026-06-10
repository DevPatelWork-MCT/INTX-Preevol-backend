import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { companyTable } from '../../db/schema.js'
import { createCompanyPayloadModel, updateCompanyPayloadModel } from './models.js'

class CompanyController {
    public async handleListCompanies(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const companies = company
            ? await db.select().from(companyTable).where(eq(companyTable.Name, company))
            : await db.select().from(companyTable)

        return res.json({ data: companies })
    }

    public async handleGetCompany(req: Request, res: Response) {
        const companyId = Number(req.params.id)

        if (Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid company id' })

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = [eq(companyTable.CompanyID, companyId)]

        if (company) {
            conditions.push(eq(companyTable.Name, company))
        }

        const [companyResult] = await db.select().from(companyTable).where(and(...conditions))

        if (!companyResult) return res.status(404).json({ message: 'Company not found' })

        return res.json({ data: companyResult })
    }

    public async handleCreateCompany(req: Request, res: Response) {
        const validationResult = await createCompanyPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const [created] = await db.insert(companyTable).values(validationResult.data).returning()

        return res.status(201).json({ message: 'Company created successfully', data: created })
    }

    public async handleUpdateCompany(req: Request, res: Response) {
        const companyId = Number(req.params.id)

        if (Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid company id' })

        const validationResult = await updateCompanyPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = [eq(companyTable.CompanyID, companyId)]

        if (company) {
            conditions.push(eq(companyTable.Name, company))
        }

        const [existing] = await db.select().from(companyTable).where(and(...conditions))

        if (!existing) return res.status(404).json({ message: 'Company not found' })

        const [updated] = await db.update(companyTable)
            .set(validationResult.data)
            .where(and(...conditions))
            .returning()

        return res.json({ message: 'Company updated successfully', data: updated })
    }

    public async handleDeleteCompany(req: Request, res: Response) {
        const companyId = Number(req.params.id)

        if (Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid company id' })

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = [eq(companyTable.CompanyID, companyId)]

        if (company) {
            conditions.push(eq(companyTable.Name, company))
        }

        const [existing] = await db.select().from(companyTable).where(and(...conditions))

        if (!existing) return res.status(404).json({ message: 'Company not found' })

        await db.delete(companyTable).where(and(...conditions))

        return res.json({ message: 'Company deleted successfully' })
    }
}

export default CompanyController
