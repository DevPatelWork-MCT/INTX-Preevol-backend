import express from 'express'
import type { Router } from 'express'
import QuotationController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const quotationController = new QuotationController()

export const quotationRouter: Router = express.Router()

quotationRouter.get('/', restrictToAuthenticatedUser(), asyncHandler(quotationController.handleListQuotations.bind(quotationController)))
quotationRouter.get('/:id', restrictToAuthenticatedUser(), asyncHandler(quotationController.handleGetQuotation.bind(quotationController)))
quotationRouter.post('/', restrictToAuthenticatedUser(), asyncHandler(quotationController.handleCreateQuotation.bind(quotationController)))
quotationRouter.patch('/:id', restrictToAuthenticatedUser(), asyncHandler(quotationController.handleUpdateQuotation.bind(quotationController)))
quotationRouter.delete('/:id', restrictToAuthenticatedUser(), asyncHandler(quotationController.handleDeleteQuotation.bind(quotationController)))
