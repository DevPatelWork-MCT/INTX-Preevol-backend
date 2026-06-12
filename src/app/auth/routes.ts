import express from 'express'
import type { Router } from 'express'
import multer from 'multer'

import AuthenticationController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const authenticationController = new AuthenticationController()

// Configure multer for memory storage (we save manually)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, WebP, GIF allowed."))
    }
  },
})

export const authRouter: Router = express.Router()

authRouter.post('/sign-up', asyncHandler(authenticationController.handleSignup.bind(authenticationController)))
authRouter.post('/sign-in', asyncHandler(authenticationController.handleSignin.bind(authenticationController)))
authRouter.post('/sign-out', restrictToAuthenticatedUser(), asyncHandler(authenticationController.handleSignout.bind(authenticationController)))
authRouter.get('/me', restrictToAuthenticatedUser(), asyncHandler(authenticationController.handleMe.bind(authenticationController)))
authRouter.post('/avatar', restrictToAuthenticatedUser(), upload.single("avatar"), asyncHandler(authenticationController.handleUploadAvatar.bind(authenticationController)))
authRouter.delete('/avatar', restrictToAuthenticatedUser(), asyncHandler(authenticationController.handleDeleteAvatar.bind(authenticationController)))
