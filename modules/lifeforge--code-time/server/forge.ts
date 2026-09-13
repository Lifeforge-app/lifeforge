import { createForge } from '@lifeforge/server-utils'

import schema from './schema'

const forge = createForge(schema, { modulePathAlias: 'codeTime' })

export default forge
