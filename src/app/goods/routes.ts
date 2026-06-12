import express from 'express'
import type { Router } from 'express'
import GoodsController from './controller.js'
import { restrictToAuthenticatedUser } from '../middleware/auth-middleware.js'
import { asyncHandler } from '../utils/async-handler.js'
import * as MC from './master-controller.js'

const goodsController = new GoodsController()
export const goodsRouter: Router = express.Router()

goodsRouter.use(restrictToAuthenticatedUser())

// Goods
goodsRouter.get('/', asyncHandler(goodsController.handleListGoods.bind(goodsController)))
goodsRouter.get('/:id', asyncHandler(goodsController.handleGetGood.bind(goodsController)))
goodsRouter.post('/', asyncHandler(goodsController.handleCreateGood.bind(goodsController)))
goodsRouter.patch('/:id', asyncHandler(goodsController.handleUpdateGood.bind(goodsController)))
goodsRouter.delete('/:id', asyncHandler(goodsController.handleDeleteGood.bind(goodsController)))

// Inventory
goodsRouter.get('/inventory/all', asyncHandler(goodsController.handleListInventory.bind(goodsController)))
goodsRouter.get('/inventory/:id', asyncHandler(goodsController.handleGetInventory.bind(goodsController)))
goodsRouter.post('/inventory', asyncHandler(goodsController.handleCreateInventory.bind(goodsController)))
goodsRouter.patch('/inventory/:id', asyncHandler(goodsController.handleUpdateInventory.bind(goodsController)))
goodsRouter.delete('/inventory/:id', asyncHandler(goodsController.handleDeleteInventory.bind(goodsController)))

// Types
goodsRouter.get('/types', asyncHandler(MC.handleListTypes))
goodsRouter.post('/types', asyncHandler(MC.handleCreateType))
goodsRouter.patch('/types/:id', asyncHandler(MC.handleUpdateType))
goodsRouter.delete('/types/:id', asyncHandler(MC.handleDeleteType))

// Models
goodsRouter.get('/models', asyncHandler(MC.handleListModels))
goodsRouter.post('/models', asyncHandler(MC.handleCreateModel))
goodsRouter.patch('/models/:id', asyncHandler(MC.handleUpdateModel))
goodsRouter.delete('/models/:id', asyncHandler(MC.handleDeleteModel))

// Plunger Diameters
goodsRouter.get('/plunger-diameters', asyncHandler(MC.handleListPlungerDiameters))
goodsRouter.post('/plunger-diameters', asyncHandler(MC.handleCreatePlungerDiameter))
goodsRouter.patch('/plunger-diameters/:id', asyncHandler(MC.handleUpdatePlungerDiameter))
goodsRouter.delete('/plunger-diameters/:id', asyncHandler(MC.handleDeletePlungerDiameter))

// MOCs
goodsRouter.get('/mocs', asyncHandler(MC.handleListMOCs))
goodsRouter.post('/mocs', asyncHandler(MC.handleCreateMOC))
goodsRouter.patch('/mocs/:id', asyncHandler(MC.handleUpdateMOC))
goodsRouter.delete('/mocs/:id', asyncHandler(MC.handleDeleteMOC))

// Stock Categories
goodsRouter.get('/stock-categories', asyncHandler(MC.handleListStockCategories))
goodsRouter.post('/stock-categories', asyncHandler(MC.handleCreateStockCategory))
goodsRouter.patch('/stock-categories/:id', asyncHandler(MC.handleUpdateStockCategory))
goodsRouter.delete('/stock-categories/:id', asyncHandler(MC.handleDeleteStockCategory))

// Stock Sub Categories
goodsRouter.get('/stock-sub-categories', asyncHandler(MC.handleListStockSubCategories))
goodsRouter.post('/stock-sub-categories', asyncHandler(MC.handleCreateStockSubCategory))
goodsRouter.patch('/stock-sub-categories/:id', asyncHandler(MC.handleUpdateStockSubCategory))
goodsRouter.delete('/stock-sub-categories/:id', asyncHandler(MC.handleDeleteStockSubCategory))

// Stock Products
goodsRouter.get('/stock-products', asyncHandler(MC.handleListStockProducts))
goodsRouter.post('/stock-products', asyncHandler(MC.handleCreateStockProduct))
goodsRouter.patch('/stock-products/:id', asyncHandler(MC.handleUpdateStockProduct))
goodsRouter.delete('/stock-products/:id', asyncHandler(MC.handleDeleteStockProduct))
