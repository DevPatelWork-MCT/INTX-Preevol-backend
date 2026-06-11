import express from 'express'
import type { Router } from 'express'

import CompanyController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const companyController = new CompanyController()

export const companyRouter: Router = express.Router()

companyRouter.use(restrictToAuthenticatedUser())

companyRouter.get('/', asyncHandler(companyController.handleListCompanies.bind(companyController)))
companyRouter.get('/:id', asyncHandler(companyController.handleGetCompany.bind(companyController)))
companyRouter.post('/', asyncHandler(companyController.handleCreateCompany.bind(companyController)))
companyRouter.patch('/:id', asyncHandler(companyController.handleUpdateCompany.bind(companyController)))
companyRouter.delete('/:id', asyncHandler(companyController.handleDeleteCompany.bind(companyController)))

// Financial year routes nested under company
companyRouter.get('/:id/financial-years', asyncHandler(companyController.handleListFinancialYears.bind(companyController)))
companyRouter.post('/:id/financial-years', asyncHandler(companyController.handleCreateFinancialYear.bind(companyController)))
companyRouter.patch('/:id/financial-years/:financialYearId', asyncHandler(companyController.handleUpdateFinancialYear.bind(companyController)))
companyRouter.delete('/:id/financial-years/:financialYearId', asyncHandler(companyController.handleDeleteFinancialYear.bind(companyController)))
