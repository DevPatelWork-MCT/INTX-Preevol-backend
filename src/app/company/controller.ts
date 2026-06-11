import type { Request, Response } from 'express'
import { and, eq, ilike, desc, asc, sql, inArray } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { companyTable, financialSettingsTable } from '../../db/schema.js'
import { createCompanyPayloadModel, updateCompanyPayloadModel, listCompaniesQueryModel } from './models.js'
import { createFinancialYearPayloadModel, updateFinancialYearPayloadModel } from '../financial/models.js'

class CompanyController {
    public async handleListCompanies(req: Request, res: Response) {
        // ── Validate query params ──────────────────────────────────
        const queryResult = listCompaniesQueryModel.safeParse(req.query)
        if (!queryResult.success) {
            return res.status(400).json({ message: 'Invalid query parameters', error: queryResult.error.issues })
        }

        const { page, limit, search, sortBy, sortOrder } = queryResult.data
        const offset = (page - 1) * limit

        // ── Build filter conditions ────────────────────────────────
        const conditions = []
        if (search) {
            conditions.push(ilike(companyTable.Name, `%${search}%`))
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined

        // ── Determine sort column ──────────────────────────────────
        const sortColumnMap = {
            Name: companyTable.Name,
            createdAt: companyTable.createdAt,
            CompanyID: companyTable.CompanyID,
        } as const
        const sortColumn = sortColumnMap[sortBy as keyof typeof sortColumnMap] ?? companyTable.createdAt
        const sortFn = sortOrder === 'asc' ? asc : desc

        // ── Fetch total count ──────────────────────────────────────
        const countResult = await db
            .select({ total: sql<number>`count(*)`.mapWith(Number) })
            .from(companyTable)
            .where(whereClause)
        const total = countResult[0]?.total ?? 0

        // ── Fetch paginated data (newest first by default) ────────
        const companies = await db
            .select()
            .from(companyTable)
            .where(whereClause)
            .orderBy(sortFn(sortColumn))
            .limit(limit)
            .offset(offset)

        // ── Attach latest financial year for each company ─────────
        const companyIds = companies.map((c) => c.CompanyID)
        let latestFinancialYears: Record<number, { FinancialYear: string; StartDate: Date; EndDate: Date } | null> = {}

        if (companyIds.length > 0) {
            const fyRows = await db
                .select({
                    CompanyID: financialSettingsTable.CompanyID,
                    FinancialYear: financialSettingsTable.FinancialYear,
                    StartDate: financialSettingsTable.StartDate,
                    EndDate: financialSettingsTable.EndDate,
                })
                .from(financialSettingsTable)
                .where(inArray(financialSettingsTable.CompanyID, companyIds))
                .orderBy(desc(financialSettingsTable.StartDate))

            for (const row of fyRows) {
                if (!latestFinancialYears[row.CompanyID]) {
                    latestFinancialYears[row.CompanyID] = {
                        FinancialYear: row.FinancialYear,
                        StartDate: row.StartDate,
                        EndDate: row.EndDate,
                    }
                }
            }
        }

        const companiesWithFY = companies.map((c) => ({
            ...c,
            latestFinancialYear: latestFinancialYears[c.CompanyID] ?? null,
        }))

        return res.json({
            data: companiesWithFY,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        })
    }

    public async handleGetCompany(req: Request, res: Response) {
        const companyId = Number(req.params.id)

        if (Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid company id' })

        const includeFinancialYears = req.query.includeFinancialYears === 'true'
        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = [eq(companyTable.CompanyID, companyId)]

        if (company) {
            conditions.push(eq(companyTable.Name, company))
        }

        const [companyResult] = await db.select().from(companyTable).where(and(...conditions))

        if (!companyResult) return res.status(404).json({ message: 'Company not found' })

        if (!includeFinancialYears) return res.json({ data: companyResult })

        const financialYears = await db
            .select()
            .from(financialSettingsTable)
            .where(eq(financialSettingsTable.CompanyID, companyId))
            .orderBy(financialSettingsTable.StartDate)

        return res.json({
            data: {
                ...companyResult,
                financialYears,
            },
        })
    }

    public async handleCreateCompany(req: Request, res: Response) {
        const validationResult = await createCompanyPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const [created] = await db.insert(companyTable).values(validationResult.data as any).returning()

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
            .set(validationResult.data as any)
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

    // ── Financial Year CRUD under company context ──────────────────

    public async handleListFinancialYears(req: Request, res: Response) {
        const companyId = Number(req.params.id)
        if (Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid company id' })

        const financialYears = await db
            .select()
            .from(financialSettingsTable)
            .where(eq(financialSettingsTable.CompanyID, companyId))
            .orderBy(desc(financialSettingsTable.StartDate))

        return res.json({ data: financialYears })
    }

    public async handleCreateFinancialYear(req: Request, res: Response) {
        const companyId = Number(req.params.id)
        if (Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid company id' })

        const validationResult = await createFinancialYearPayloadModel.safeParseAsync({
            ...req.body,
            CompanyID: companyId,
        })
        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const [company] = await db.select().from(companyTable).where(eq(companyTable.CompanyID, companyId))
        if (!company) return res.status(404).json({ message: 'Company not found' })

        const [created] = await db.insert(financialSettingsTable).values(validationResult.data).returning()
        return res.status(201).json({ message: 'Financial year created successfully', data: created })
    }

    public async handleUpdateFinancialYear(req: Request, res: Response) {
        const companyId = Number(req.params.id)
        const financialYearId = Number(req.params.financialYearId)
        if (Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid company id' })
        if (Number.isNaN(financialYearId)) return res.status(400).json({ message: 'Invalid financial year id' })

        const validationResult = await updateFinancialYearPayloadModel.safeParseAsync(req.body)
        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const [existing] = await db
            .select()
            .from(financialSettingsTable)
            .where(and(
                eq(financialSettingsTable.CompanyID, companyId),
                eq(financialSettingsTable.FinancialYearID, financialYearId),
            ))
        if (!existing) return res.status(404).json({ message: 'Financial year not found' })

        const [updated] = await db
            .update(financialSettingsTable)
            .set(validationResult.data)
            .where(and(
                eq(financialSettingsTable.CompanyID, companyId),
                eq(financialSettingsTable.FinancialYearID, financialYearId),
            ))
            .returning()

        return res.json({ message: 'Financial year updated successfully', data: updated })
    }

    public async handleDeleteFinancialYear(req: Request, res: Response) {
        const companyId = Number(req.params.id)
        const financialYearId = Number(req.params.financialYearId)
        if (Number.isNaN(companyId)) return res.status(400).json({ message: 'Invalid company id' })
        if (Number.isNaN(financialYearId)) return res.status(400).json({ message: 'Invalid financial year id' })

        const [existing] = await db
            .select()
            .from(financialSettingsTable)
            .where(and(
                eq(financialSettingsTable.CompanyID, companyId),
                eq(financialSettingsTable.FinancialYearID, financialYearId),
            ))
        if (!existing) return res.status(404).json({ message: 'Financial year not found' })

        await db.delete(financialSettingsTable).where(and(
            eq(financialSettingsTable.CompanyID, companyId),
            eq(financialSettingsTable.FinancialYearID, financialYearId),
        ))

        return res.json({ message: 'Financial year deleted successfully' })
    }
}

export default CompanyController
