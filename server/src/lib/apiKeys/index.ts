import { forgeRouter } from '@functions/routes'
import { v4 } from 'uuid'

import authRouter from './routes/auth'
import entriesRouter from './routes/entries'

export let challenge = v4()

setTimeout(() => {
  challenge = v4()
}, 1000 * 60)

export default forgeRouter({
  auth: authRouter,
  entries: entriesRouter
})
