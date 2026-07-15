import { createForge } from '@lifeforge/server-utils'

import schema from './schema'

const forge = createForge(schema, 'auth')

export default forge
