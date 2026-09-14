import { createForgeContractBuilder } from '@lifeforge/server-utils'
import type { AppRelations } from '@/core/drizzle'

const forge = createForgeContractBuilder<AppRelations>('auth')

export default forge
