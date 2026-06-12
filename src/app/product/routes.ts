import express from 'express'
import type { Router } from 'express'
import ProductController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'

const productController = new ProductController()
export const productRouter: Router = express.Router()

productRouter.use(restrictToAuthenticatedUser())

// Products
productRouter.get('/', asyncHandler(productController.handleListProducts.bind(productController)))
productRouter.get('/:id', asyncHandler(productController.handleGetProduct.bind(productController)))
productRouter.post('/', asyncHandler(productController.handleCreateProduct.bind(productController)))
productRouter.patch('/:id', asyncHandler(productController.handleUpdateProduct.bind(productController)))
productRouter.delete('/:id', asyncHandler(productController.handleDeleteProduct.bind(productController)))

// PO Products
productRouter.get('/po/all', asyncHandler(productController.handleListPOProducts.bind(productController)))
productRouter.get('/po/:id', asyncHandler(productController.handleGetPOProduct.bind(productController)))
productRouter.post('/po', asyncHandler(productController.handleCreatePOProduct.bind(productController)))
productRouter.patch('/po/:id', asyncHandler(productController.handleUpdatePOProduct.bind(productController)))
productRouter.delete('/po/:id', asyncHandler(productController.handleDeletePOProduct.bind(productController)))
