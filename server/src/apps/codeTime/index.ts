import forgeRouter from '@functions/forgeRouter'

import codeTimeRouter from './controllers/codeTime'

export default forgeRouter({
  '/': codeTimeRouter
})
