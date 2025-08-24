import { v4 } from 'uuid'

import AuthRouter from './routes/auth'

export let challenge = v4()

setTimeout(() => {
  challenge = v4()
}, 1000 * 60)

export default {
  auth: AuthRouter
}
