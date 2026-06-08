import express from 'express'
import type { Router } from 'express'

import AdminController from './controller.js'
import { restrictToAdmin, restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const adminController = new AdminController()

export const adminRouter: Router = express.Router()

adminRouter.use(restrictToAuthenticatedUser(), restrictToAdmin())

adminRouter.get('/users', asyncHandler(adminController.handleListUsers.bind(adminController)))
adminRouter.get('/users/:id', asyncHandler(adminController.handleGetUser.bind(adminController)))
adminRouter.patch('/users/:id/approve', asyncHandler(adminController.handleApproveUser.bind(adminController)))
adminRouter.patch('/users/:id/reject', asyncHandler(adminController.handleRejectUser.bind(adminController)))
adminRouter.patch('/users/:id/role', asyncHandler(adminController.handleUpdateUserRole.bind(adminController)))

adminRouter.get('/roles', asyncHandler(adminController.handleListRoles.bind(adminController)))
adminRouter.post('/roles', asyncHandler(adminController.handleCreateRole.bind(adminController)))
adminRouter.patch('/roles/:id', asyncHandler(adminController.handleUpdateRole.bind(adminController)))
adminRouter.delete('/roles/:id', asyncHandler(adminController.handleDeleteRole.bind(adminController)))
