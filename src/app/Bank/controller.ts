import type { Request, Response } from 'express'
import { and, eq, ilike, desc, asc, sql } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { bankTable, companyTable } from '../../db/schema.js'
import { createBankPayloadModel, updateBankPayloadModel, listBanksQueryModel } from './models.js'

class BankController {
    public async handleListBanks(req: Request, res: Response) {
        const queryResult = listBanksQueryModel.safeParse(req.query)
        if (!queryResult.success) {
            return res.status(400).json({ message: 'Invalid query parameters', error: queryResult.error.issues })
        }

        const { page, limit, search, sortBy, sortOrder, companyId } = queryResult.data
        const offset = (page - 1) * limit

        const conditions = []
        if (search) {
            conditions.push(ilike(bankTable.BankName, `%${search}%`))
        }
        if (companyId) {
            conditions.push(eq(bankTable.CompanyID, companyId))
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined

        const sortColumnMap = {
            BankName: bankTable.BankName,
            createdAt: bankTable.createdAt,
            BankID: bankTable.BankID,
        } as const
        const sortColumn = sortColumnMap[sortBy as keyof typeof sortColumnMap] ?? bankTable.createdAt
        const sortFn = sortOrder === 'asc' ? asc : desc

        const countResult = await db
            .select({ total: sql<number>`count(*)`.mapWith(Number) })
            .from(bankTable)
            .where(whereClause)
        const total = countResult[0]?.total ?? 0

        const banks = await db
            .select()
            .from(bankTable)
            .where(whereClause)
            .orderBy(sortFn(sortColumn))
            .limit(limit)
            .offset(offset)

        return res.json({
            data: banks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    }

    public async handleGetBank(req: Request, res: Response) {
        const bankId = Number(req.params.id)

        if (Number.isNaN(bankId)) return res.status(400).json({ message: 'Invalid bank id' })

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const companyId = typeof req.query.companyId === 'string' ? Number(req.query.companyId) : undefined

        if (companyId && Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid companyId' })

        const conditions = [eq(bankTable.BankID, bankId)]

        if (company) conditions.push(eq(bankTable.Company, company))
        if (companyId) conditions.push(eq(bankTable.CompanyID, companyId))

        const [bank] = await db.select().from(bankTable).where(and(...conditions))

        if (!bank) return res.status(404).json({ message: 'Bank not found' })

        return res.json({ data: bank })
    }

    public async handleCreateBank(req: Request, res: Response) {
        const validationResult = await createBankPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const payload = validationResult.data

        if (payload.CompanyID) {
            const [company] = await db.select().from(companyTable).where(eq(companyTable.CompanyID, payload.CompanyID))
            if (!company) return res.status(400).json({ message: 'Invalid CompanyID' })
        }

        const [created] = await db.insert(bankTable).values(payload).returning()

        return res.status(201).json({ message: 'Bank created successfully', data: created })
    }

    public async handleUpdateBank(req: Request, res: Response) {
        const bankId = Number(req.params.id)

        if (Number.isNaN(bankId)) return res.status(400).json({ message: 'Invalid bank id' })

        const validationResult = await updateBankPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const companyId = typeof req.query.companyId === 'string' ? Number(req.query.companyId) : undefined

        if (companyId && Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid companyId' })

        const conditions = [eq(bankTable.BankID, bankId)]

        if (company) conditions.push(eq(bankTable.Company, company))
        if (companyId) conditions.push(eq(bankTable.CompanyID, companyId))

        const [existing] = await db.select().from(bankTable).where(and(...conditions))

        if (!existing) return res.status(404).json({ message: 'Bank not found' })

        if (validationResult.data.CompanyID) {
            const [company] = await db.select().from(companyTable).where(eq(companyTable.CompanyID, validationResult.data.CompanyID))
            if (!company) return res.status(400).json({ message: 'Invalid CompanyID' })
        }

        const [updated] = await db.update(bankTable)
            .set(validationResult.data)
            .where(and(...conditions))
            .returning()

        return res.json({ message: 'Bank updated successfully', data: updated })
    }

    public async handleDeleteBank(req: Request, res: Response) {
        const bankId = Number(req.params.id)

        if (Number.isNaN(bankId)) return res.status(400).json({ message: 'Invalid bank id' })

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const companyId = typeof req.query.companyId === 'string' ? Number(req.query.companyId) : undefined

        if (companyId && Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid companyId' })

        const conditions = [eq(bankTable.BankID, bankId)]

        if (company) conditions.push(eq(bankTable.Company, company))
        if (companyId) conditions.push(eq(bankTable.CompanyID, companyId))

        const [existing] = await db.select().from(bankTable).where(and(...conditions))

        if (!existing) return res.status(404).json({ message: 'Bank not found' })

        await db.delete(bankTable).where(and(...conditions))

        return res.json({ message: 'Bank deleted successfully' })
    }
}

export default BankController
