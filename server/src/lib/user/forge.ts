import { createForge } from '@lifeforge/server-utils'

import schema from './schema'

const forge = createForge(schema, 'user')

export default forge
