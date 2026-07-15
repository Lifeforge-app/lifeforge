import { createForge } from '@lifeforge/server-utils'

const authSchemas = {} as Record<string, { schema: import('zod').ZodTypeAny }>

const forge = createForge(authSchemas, 'auth')

export default forge
