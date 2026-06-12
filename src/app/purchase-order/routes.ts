import express from 'express'
import type { Router } from 'express'
import PurchaseOrderController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const purchaseOrderController = new PurchaseOrderController()
export const purchaseOrderRouter: Router = express.Router()

purchaseOrderRouter.use(restrictToAuthenticatedUser())

purchaseOrderRouter.get('/', asyncHandler(purchaseOrderController.handleListPurchaseOrders.bind(purchaseOrderController)))
purchaseOrderRouter.get('/:id', asyncHandler(purchaseOrderController.handleGetPurchaseOrder.bind(purchaseOrderController)))
purchaseOrderRouter.post('/', asyncHandler(purchaseOrderController.handleCreatePurchaseOrder.bind(purchaseOrderController)))
purchaseOrderRouter.patch('/:id', asyncHandler(purchaseOrderController.handleUpdatePurchaseOrder.bind(purchaseOrderController)))
purchaseOrderRouter.delete('/:id', asyncHandler(purchaseOrderController.handleDeletePurchaseOrder.bind(purchaseOrderController)))
