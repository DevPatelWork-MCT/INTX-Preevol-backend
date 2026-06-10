import express from 'express'
import type { Router } from 'express'

import PartyController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const partyController = new PartyController()

export const partyRouter: Router = express.Router()

partyRouter.use(restrictToAuthenticatedUser())

partyRouter.get('/', asyncHandler(partyController.handleListParties.bind(partyController)))
partyRouter.get('/:id', asyncHandler(partyController.handleGetParty.bind(partyController)))
partyRouter.post('/', asyncHandler(partyController.handleCreateParty.bind(partyController)))
partyRouter.patch('/:id', asyncHandler(partyController.handleUpdateParty.bind(partyController)))
partyRouter.delete('/:id', asyncHandler(partyController.handleDeleteParty.bind(partyController)))
