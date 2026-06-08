import express from 'express'
import type { Router } from 'express'

import AuthenticationController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const authenticationController = new AuthenticationController()

export const authRouter: Router = express.Router()

authRouter.post('/sign-up', asyncHandler(authenticationController.handleSignup.bind(authenticationController)))
authRouter.post('/sign-in', asyncHandler(authenticationController.handleSignin.bind(authenticationController)))
authRouter.post('/sign-out', restrictToAuthenticatedUser(), asyncHandler(authenticationController.handleSignout.bind(authenticationController)))
authRouter.get('/me', restrictToAuthenticatedUser(), asyncHandler(authenticationController.handleMe.bind(authenticationController)))
