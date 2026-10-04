import { createForgeContractBuilder } from '@lifeforge/server-utils'

import type { CoreRelations } from '@/core/drizzle'

const forge = createForgeContractBuilder<CoreRelations>({ moduleId: 'user' })

export default forge
