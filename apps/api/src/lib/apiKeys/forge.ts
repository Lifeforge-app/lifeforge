import { createForge } from '@lifeforge/server-utils'

import schema from './schema'

const forge = createForge(schema, 'api_keys')

export default forge
