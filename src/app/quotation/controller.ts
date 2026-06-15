import type { Request, Response } from 'express'
import { and, eq, ilike, desc, asc, sql } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { createQuotationPayloadModel, updateQuotationPayloadModel, listQuotationsQueryModel } from './models.js'

// Simple in-memory store for quotations (no DB table yet)
// In production, this would use a proper quotationTable from schema
const quotations: any[] = []
let nextId = 1

const toNullable = (value: unknown): unknown => {
    if (value === '' || value === undefined || value === null) return null
    return value
}

const toDecimal = (value: unknown): number => {
    if (value === '' || value === undefined || value === null) return 0
    if (typeof value === 'boolean') return value ? 1 : 0
    const num = Number(value)
    return isNaN(num) ? 0 : num
}

class QuotationController {
    public async handleListQuotations(req: Request, res: Response) {
        const queryResult = listQuotationsQueryModel.safeParse(req.query)
        if (!queryResult.success) {
            return res.status(400).json({ message: 'Invalid query parameters', error: queryResult.error.issues })
        }

        const { page, limit, search, sortBy, sortOrder } = queryResult.data
        const offset = (page - 1) * limit

        let filtered = [...quotations]

        if (search) {
            const q = search.toLowerCase()
            filtered = filtered.filter((item: any) =>
                (item.QuotationNo || "").toLowerCase().includes(q) ||
                (item.ReceiverName || "").toLowerCase().includes(q) ||
                (item.ReceiverGSTIN || "").toLowerCase().includes(q)
            )
        }

        const total = filtered.length

        // Sort
        const sortFieldMap: Record<string, string> = {
            QuotationNo: "QuotationNo",
            QuotationDate: "QuotationDate",
            createdAt: "createdAt",
            QuotationID: "QuotationID",
        }
        const sortField = sortFieldMap[sortBy] || "createdAt"
        filtered.sort((a: any, b: any) => {
            const aVal = a[sortField] || ""
            const bVal = b[sortField] || ""
            const cmp = String(aVal).localeCompare(String(bVal))
            return sortOrder === "asc" ? cmp : -cmp
        })

        const paginated = filtered.slice(offset, offset + limit)

        return res.json({
            data: paginated,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    }

    public async handleGetQuotation(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid quotation id' })

        const quotation = quotations.find((q: any) => q.QuotationID === id)
        if (!quotation) return res.status(404).json({ message: 'Quotation not found' })

        return res.json({ data: quotation })
    }

    public async handleCreateQuotation(req: Request, res: Response) {
        const result = await createQuotationPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })

        const { lineItems, ...quotationData } = result.data

        const cleanPayload: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(quotationData)) {
            if (value === undefined) continue
            if (key === 'IsSameAddress') {
                cleanPayload[key] = value === null ? false : Boolean(value)
            } else if (['TotalAmtBeforeTax', 'PackingCharge', 'PCGSTRate', 'PCGSTAmt', 'PSGSTRate', 'PSGSTAmt',
                        'PIGSTRate', 'PIGSTAmt', 'CGST', 'SGST', 'IGST', 'TotalGSTTax', 'TotalAmtAfterTax',
                        'GrandTotalAmount', 'RoundOff'].includes(key)) {
                cleanPayload[key] = toDecimal(value)
            } else if (key === 'SupplyStateCode') {
                cleanPayload[key] = value === null ? null : Number(value)
            } else if (['QuotationDate', 'ValidUntil'].includes(key)) {
                cleanPayload[key] = value === null || value === undefined ? null : value
            } else {
                cleanPayload[key] = toNullable(value)
            }
        }

        const now = new Date().toISOString()
        const created = {
            QuotationID: nextId++,
            ...cleanPayload,
            createdAt: now,
            updatedAt: now,
            lineItems: lineItems || [],
        }
        quotations.push(created)

        return res.status(201).json({ message: 'Quotation created', data: created })
    }

    public async handleUpdateQuotation(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid quotation id' })

        const index = quotations.findIndex((q: any) => q.QuotationID === id)
        if (index === -1) return res.status(404).json({ message: 'Quotation not found' })

        const result = await updateQuotationPayloadModel.safeParseAsync(req.body)
        if (result.error) return res.status(400).json({ message: 'Validation failed', error: result.error.issues })

        const { lineItems, ...quotationData } = result.data

        const cleanPayload: Record<string, unknown> = {}
        for (const [key, value] of Object.entries(quotationData)) {
            if (value === undefined) continue
            if (key === 'IsSameAddress') {
                cleanPayload[key] = value === null ? false : Boolean(value)
            } else if (['TotalAmtBeforeTax', 'PackingCharge', 'PCGSTRate', 'PCGSTAmt', 'PSGSTRate', 'PSGSTAmt',
                        'PIGSTRate', 'PIGSTAmt', 'CGST', 'SGST', 'IGST', 'TotalGSTTax', 'TotalAmtAfterTax',
                        'GrandTotalAmount', 'RoundOff'].includes(key)) {
                cleanPayload[key] = toDecimal(value)
            } else if (key === 'SupplyStateCode') {
                cleanPayload[key] = value === null ? null : Number(value)
            } else if (['QuotationDate', 'ValidUntil'].includes(key)) {
                cleanPayload[key] = value === null || value === undefined ? null : value
            } else {
                cleanPayload[key] = toNullable(value)
            }
        }

        quotations[index] = {
            ...quotations[index],
            ...cleanPayload,
            updatedAt: new Date().toISOString(),
            lineItems: lineItems || quotations[index].lineItems || [],
        }

        return res.json({ message: 'Quotation updated', data: quotations[index] })
    }

    public async handleDeleteQuotation(req: Request, res: Response) {
        const id = Number(req.params.id)
        if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid quotation id' })

        const index = quotations.findIndex((q: any) => q.QuotationID === id)
        if (index === -1) return res.status(404).json({ message: 'Quotation not found' })

        quotations.splice(index, 1)
        return res.json({ message: 'Quotation deleted' })
    }
}

export default QuotationController
