import express from 'express'
import type { Express } from 'express'


export function createApplication(): Express {
    const app = express()

    // Middlewares
    app.use(express.json())
   
    // Routes
    app.get('/', (req, res) => {
        return res.json({ message: 'Welcome to ChaiCode Auth Service' })
    })


    return app
}