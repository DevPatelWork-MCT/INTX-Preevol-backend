import express from 'express'
import type { Router } from 'express'
import CategoryController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const categoryController = new CategoryController()
export const categoryRouter: Router = express.Router()

categoryRouter.use(restrictToAuthenticatedUser())

// Categories
categoryRouter.get('/', asyncHandler(categoryController.handleListCategories.bind(categoryController)))
categoryRouter.get('/:id', asyncHandler(categoryController.handleGetCategory.bind(categoryController)))
categoryRouter.post('/', asyncHandler(categoryController.handleCreateCategory.bind(categoryController)))
categoryRouter.patch('/:id', asyncHandler(categoryController.handleUpdateCategory.bind(categoryController)))
categoryRouter.delete('/:id', asyncHandler(categoryController.handleDeleteCategory.bind(categoryController)))

// Sub Categories
categoryRouter.get('/sub/all', asyncHandler(categoryController.handleListSubCategories.bind(categoryController)))
categoryRouter.get('/sub/:id', asyncHandler(categoryController.handleGetSubCategory.bind(categoryController)))
categoryRouter.post('/sub', asyncHandler(categoryController.handleCreateSubCategory.bind(categoryController)))
categoryRouter.patch('/sub/:id', asyncHandler(categoryController.handleUpdateSubCategory.bind(categoryController)))
categoryRouter.delete('/sub/:id', asyncHandler(categoryController.handleDeleteSubCategory.bind(categoryController)))
