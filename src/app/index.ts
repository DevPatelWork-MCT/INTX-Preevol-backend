import express from 'express'
import type { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'

import { authRouter } from './auth/routes.js'
import { adminRouter } from './admin/routes.js'
import { partyRouter } from './party/routes.js'
import { companyRouter } from './company/routes.js'
import { bankRouter } from './Bank/routes.js'
import { financialRouter } from './financial/routes.js'
import { categoryRouter } from './category/routes.js'
import { productRouter } from './product/routes.js'
import { vendorRouter } from './vendor/routes.js'
import { invoiceRouter } from './invoice/routes.js'
import { purchaseOrderRouter } from './purchase-order/routes.js'
import { goodsRouter } from './goods/routes.js'
import { authenticationMiddleware } from './middleware/auth-middleware.js'
import { openApiSpec } from './openapi.js'

export function createApplication(): Express {
    const app = express()

    // Middlewares
        // Allow requests from the frontend (running on localhost:3000) and include credentials
        app.use(
            cors({
                origin: process.env.FRONTEND_URL || 'http://localhost:3000',
                credentials: true,
            })
        )
    app.use(express.json())
    app.use(authenticationMiddleware())


    // Routes
    app.get('/', (req, res) => {
        return res.json({ message: 'Base test route' })
    })

    app.get('/openapi.json', (_req, res) => res.json(openApiSpec))

    app.use('/auth', authRouter)
    app.use('/admin', adminRouter)
    app.use('/party', partyRouter)
    app.use('/company', companyRouter)
    app.use('/bank', bankRouter)
    app.use('/financial-years', financialRouter)
    app.use('/category', categoryRouter)
    app.use('/product', productRouter)
    app.use('/vendor', vendorRouter)
    app.use('/invoice', invoiceRouter)
    app.use('/purchase-order', purchaseOrderRouter)
    app.use('/goods', goodsRouter)

    // Error handler
    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.error('Unhandled error:', err)
        return res.status(500).json({ error: 'Internal server error', message: err.message })
    })

    return app
}