import express from 'express'
import type { Router } from 'express'
import InvoiceController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const invoiceController = new InvoiceController()
export const invoiceRouter: Router = express.Router()

invoiceRouter.use(restrictToAuthenticatedUser())

invoiceRouter.get('/', asyncHandler(invoiceController.handleListInvoices.bind(invoiceController)))
invoiceRouter.get('/:id', asyncHandler(invoiceController.handleGetInvoice.bind(invoiceController)))
invoiceRouter.post('/', asyncHandler(invoiceController.handleCreateInvoice.bind(invoiceController)))
invoiceRouter.patch('/:id', asyncHandler(invoiceController.handleUpdateInvoice.bind(invoiceController)))
invoiceRouter.delete('/:id', asyncHandler(invoiceController.handleDeleteInvoice.bind(invoiceController)))
