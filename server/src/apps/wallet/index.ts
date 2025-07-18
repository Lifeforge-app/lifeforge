import express from 'express'

import walletAssetsRouter from './controllers/assets.controller'
import walletCategoriesRouter from './controllers/categories.controller'
import walletLedgersRouter from './controllers/ledgers.controller'
import walletTransactionsRouter from './controllers/transactions.controller'
import walletUtilsRouter from './controllers/utils.controller'

const router = express.Router()

router.use('/transactions', walletTransactionsRouter)
router.use('/categories', walletCategoriesRouter)
router.use('/assets', walletAssetsRouter)
router.use('/ledgers', walletLedgersRouter)
router.use('/utils', walletUtilsRouter)

export default router
