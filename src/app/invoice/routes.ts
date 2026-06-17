import express from 'express'
import type { Router } from 'express'
import InvoiceController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const invoiceController = new InvoiceController()
export const invoiceRouter: Router = express.Router()

invoiceRouter.use(restrictToAuthenticatedUser())

// ── Sales Invoice CRUD ────────────────────────────────────────────
invoiceRouter.get('/', asyncHandler(invoiceController.handleListInvoices.bind(invoiceController)))
invoiceRouter.get('/:id', asyncHandler(invoiceController.handleGetInvoice.bind(invoiceController)))
invoiceRouter.post('/', asyncHandler(invoiceController.handleCreateInvoice.bind(invoiceController)))
invoiceRouter.patch('/:id', asyncHandler(invoiceController.handleUpdateInvoice.bind(invoiceController)))
invoiceRouter.delete('/:id', asyncHandler(invoiceController.handleDeleteInvoice.bind(invoiceController)))

// ── Invoice Number Generation ─────────────────────────────────────
invoiceRouter.get('/generate-no', asyncHandler(invoiceController.handleGenerateInvoiceNo.bind(invoiceController)))

// ── Party & Product Lookup (for auto-fill) ────────────────────────
invoiceRouter.get('/lookup/party', asyncHandler(invoiceController.handleGetPartyDetails.bind(invoiceController)))
invoiceRouter.get('/lookup/parties', asyncHandler(invoiceController.handleListParties.bind(invoiceController)))
invoiceRouter.get('/lookup/product', asyncHandler(invoiceController.handleGetProductDetails.bind(invoiceController)))
invoiceRouter.get('/lookup/products', asyncHandler(invoiceController.handleListProducts.bind(invoiceController)))

// ── Service Invoice CRUD ──────────────────────────────────────────
invoiceRouter.get('/service', asyncHandler(invoiceController.handleListServiceInvoices.bind(invoiceController)))
invoiceRouter.get('/service/:id', asyncHandler(invoiceController.handleGetServiceInvoice.bind(invoiceController)))

// ── Proforma Invoice CRUD ─────────────────────────────────────────
invoiceRouter.get('/proforma', asyncHandler(invoiceController.handleListProformaInvoices.bind(invoiceController)))
invoiceRouter.get('/proforma/:id', asyncHandler(invoiceController.handleGetProformaInvoice.bind(invoiceController)))
