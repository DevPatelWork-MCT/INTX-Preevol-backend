import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { companyTable, financialSettingsTable } from '../../db/schema.js'
import {
    createFinancialYearPayloadModel,
    financialYearParamsModel,
    updateFinancialYearPayloadModel,
} from './models.js'

class FinancialController {
    public async handleListFinancialYears(req: Request, res: Response) {
        const companyId = typeof req.query.companyId === 'string' ? Number(req.query.companyId) : undefined

        if (companyId && Number.isNaN(companyId)) {
            return res.status(400).json({ message: 'Invalid companyId' })
        }

        const financialYears = companyId
            ? await db.select().from(financialSettingsTable).where(eq(financialSettingsTable.CompanyID, companyId))
            : await db.select().from(financialSettingsTable)

        return res.json({ data: financialYears })
    }

    public async handleGetFinancialYear(req: Request, res: Response) {
        const parsedParams = financialYearParamsModel.safeParse({
            companyId: req.params.companyId,
            financialYearId: req.params.id,
        })

        if (parsedParams.error) {
            return res.status(400).json({ message: 'Invalid financial year params', error: parsedParams.error.issues })
        }

        const [financialYear] = await db
            .select()
            .from(financialSettingsTable)
            .where(
                and(
                    eq(financialSettingsTable.CompanyID, parsedParams.data.companyId),
                    eq(financialSettingsTable.FinancialYearID, parsedParams.data.financialYearId!)
                )
            )

        if (!financialYear) return res.status(404).json({ message: 'Financial year not found' })

        return res.json({ data: financialYear })
    }

    public async handleCreateFinancialYear(req: Request, res: Response) {
        const validationResult = await createFinancialYearPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const payload = validationResult.data
        const [company] = await db.select().from(companyTable).where(eq(companyTable.CompanyID, payload.CompanyID))

        if (!company) return res.status(400).json({ message: 'Invalid CompanyID' })

        const [created] = await db.insert(financialSettingsTable).values(payload).returning()

        return res.status(201).json({ message: 'Financial year created successfully', data: created })
    }

    public async handleUpdateFinancialYear(req: Request, res: Response) {
        const parsedParams = financialYearParamsModel.safeParse({
            companyId: req.params.companyId,
            financialYearId: req.params.id,
        })

        if (parsedParams.error) {
            return res.status(400).json({ message: 'Invalid financial year params', error: parsedParams.error.issues })
        }

        const validationResult = await updateFinancialYearPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const [existing] = await db
            .select()
            .from(financialSettingsTable)
            .where(
                and(
                    eq(financialSettingsTable.CompanyID, parsedParams.data.companyId),
                    eq(financialSettingsTable.FinancialYearID, parsedParams.data.financialYearId!)
                )
            )

        if (!existing) return res.status(404).json({ message: 'Financial year not found' })

        const [updated] = await db
            .update(financialSettingsTable)
            .set(validationResult.data)
            .where(
                and(
                    eq(financialSettingsTable.CompanyID, parsedParams.data.companyId),
                    eq(financialSettingsTable.FinancialYearID, parsedParams.data.financialYearId!)
                )
            )
            .returning()

        return res.json({ message: 'Financial year updated successfully', data: updated })
    }

    public async handleDeleteFinancialYear(req: Request, res: Response) {
        const parsedParams = financialYearParamsModel.safeParse({
            companyId: req.params.companyId,
            financialYearId: req.params.id,
        })

        if (parsedParams.error) {
            return res.status(400).json({ message: 'Invalid financial year params', error: parsedParams.error.issues })
        }

        const [existing] = await db
            .select()
            .from(financialSettingsTable)
            .where(
                and(
                    eq(financialSettingsTable.CompanyID, parsedParams.data.companyId),
                    eq(financialSettingsTable.FinancialYearID, parsedParams.data.financialYearId!)
                )
            )

        if (!existing) return res.status(404).json({ message: 'Financial year not found' })

        await db
            .delete(financialSettingsTable)
            .where(
                and(
                    eq(financialSettingsTable.CompanyID, parsedParams.data.companyId),
                    eq(financialSettingsTable.FinancialYearID, parsedParams.data.financialYearId!)
                )
            )

        return res.json({ message: 'Financial year deleted successfully' })
    }
}

export default FinancialController
