import forgeRouter from '@functions/forgeRouter'

import assetsRouter from './controllers/assets'
import categoriesRouter from './controllers/categories'
import ledgersRouter from './controllers/ledgers'
import transactionsRouter from './controllers/transactions'
import utilsRouter from './controllers/utils'

export default forgeRouter({
  '/transactions': transactionsRouter,
  '/categories': categoriesRouter,
  '/assets': assetsRouter,
  '/ledgers': ledgersRouter,
  '/utils': utilsRouter
})
