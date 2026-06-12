import express from 'express'
import type { Router } from 'express'
import VendorController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const vendorController = new VendorController()
export const vendorRouter: Router = express.Router()

vendorRouter.use(restrictToAuthenticatedUser())

vendorRouter.get('/', asyncHandler(vendorController.handleListVendors.bind(vendorController)))
vendorRouter.get('/:id', asyncHandler(vendorController.handleGetVendor.bind(vendorController)))
vendorRouter.post('/', asyncHandler(vendorController.handleCreateVendor.bind(vendorController)))
vendorRouter.patch('/:id', asyncHandler(vendorController.handleUpdateVendor.bind(vendorController)))
vendorRouter.delete('/:id', asyncHandler(vendorController.handleDeleteVendor.bind(vendorController)))
