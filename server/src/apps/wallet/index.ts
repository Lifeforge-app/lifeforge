import { forgeRouter } from '@functions/routes'

import assetsRouter from './routes/assets'
import categoriesRouter from './routes/categories'
import ledgersRouter from './routes/ledgers'
import transactionsRouter from './routes/transactions'
import utilsRouter from './routes/utils'

export default forgeRouter({
  transactions: transactionsRouter,
  categories: categoriesRouter,
  assets: assetsRouter,
  ledgers: ledgersRouter,
  utils: utilsRouter
})
