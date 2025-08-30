import { v4 } from 'uuid'

import AuthRouter from './routes/auth'
import EntriesRouter from './routes/entries'

export let challenge = v4()

setTimeout(() => {
  challenge = v4()
}, 1000 * 60)

export default {
  auth: AuthRouter,
  entries: EntriesRouter
}
