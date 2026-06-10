import express from 'express'
import type { Router } from 'express'

import BankController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const bankController = new BankController()

export const bankRouter: Router = express.Router()

bankRouter.use(restrictToAuthenticatedUser())

bankRouter.get('/', asyncHandler(bankController.handleListBanks.bind(bankController)))
bankRouter.get('/:id', asyncHandler(bankController.handleGetBank.bind(bankController)))
bankRouter.post('/', asyncHandler(bankController.handleCreateBank.bind(bankController)))
bankRouter.patch('/:id', asyncHandler(bankController.handleUpdateBank.bind(bankController)))
bankRouter.delete('/:id', asyncHandler(bankController.handleDeleteBank.bind(bankController)))
