import express from 'express'
import type { Router } from 'express'

import FinancialController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const financialController = new FinancialController()

export const financialRouter: Router = express.Router()

financialRouter.use(restrictToAuthenticatedUser())

financialRouter.get('/', asyncHandler(financialController.handleListFinancialYears.bind(financialController)))
financialRouter.get('/:companyId/:id', asyncHandler(financialController.handleGetFinancialYear.bind(financialController)))
financialRouter.post('/', asyncHandler(financialController.handleCreateFinancialYear.bind(financialController)))
financialRouter.patch('/:companyId/:id', asyncHandler(financialController.handleUpdateFinancialYear.bind(financialController)))
financialRouter.delete('/:companyId/:id', asyncHandler(financialController.handleDeleteFinancialYear.bind(financialController)))
