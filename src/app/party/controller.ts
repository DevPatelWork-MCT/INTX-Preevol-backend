import type { Request, Response } from 'express'
import { and, eq } from 'drizzle-orm'
import { db } from '../../db/index.js'
import { partyTable } from '../../db/schema.js'
import { createPartyPayloadModel, updatePartyPayloadModel } from './models.js'

class PartyController {
    public async handleListParties(req: Request, res: Response) {
        const company = typeof req.query.company === 'string' ? req.query.company : undefined

        const parties = company
            ? await db.select().from(partyTable).where(eq(partyTable.Company, company))
            : await db.select().from(partyTable)

        return res.json({ data: parties })
    }

    public async handleGetParty(req: Request, res: Response) {
        const partyId = Number(req.params.id)

        if (Number.isNaN(partyId)) return res.status(400).json({ message: 'Invalid party id' })

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = [eq(partyTable.PartyID, partyId)]

        if (company) {
            conditions.push(eq(partyTable.Company, company))
        }

        const [party] = await db.select().from(partyTable).where(and(...conditions))

        if (!party) return res.status(404).json({ message: 'Party not found' })

        return res.json({ data: party })
    }

    public async handleCreateParty(req: Request, res: Response) {
        const validationResult = await createPartyPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const party = validationResult.data

        const [created] = await db.insert(partyTable).values(party).returning()

        return res.status(201).json({ message: 'Party created successfully', data: created })
    }

    public async handleUpdateParty(req: Request, res: Response) {
        const partyId = Number(req.params.id)

        if (Number.isNaN(partyId)) return res.status(400).json({ message: 'Invalid party id' })

        const validationResult = await updatePartyPayloadModel.safeParseAsync(req.body)

        if (validationResult.error) {
            return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        }

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = [eq(partyTable.PartyID, partyId)]

        if (company) {
            conditions.push(eq(partyTable.Company, company))
        }

        const [existing] = await db.select().from(partyTable).where(and(...conditions))

        if (!existing) return res.status(404).json({ message: 'Party not found' })

        const [updated] = await db.update(partyTable)
            .set(validationResult.data)
            .where(and(...conditions))
            .returning()

        return res.json({ message: 'Party updated successfully', data: updated })
    }

    public async handleDeleteParty(req: Request, res: Response) {
        const partyId = Number(req.params.id)

        if (Number.isNaN(partyId)) return res.status(400).json({ message: 'Invalid party id' })

        const company = typeof req.query.company === 'string' ? req.query.company : undefined
        const conditions = [eq(partyTable.PartyID, partyId)]

        if (company) {
            conditions.push(eq(partyTable.Company, company))
        }

        const [existing] = await db.select().from(partyTable).where(and(...conditions))

        if (!existing) return res.status(404).json({ message: 'Party not found' })

        await db.delete(partyTable).where(and(...conditions))

        return res.json({ message: 'Party deleted successfully' })
    }
}

export default PartyController
