import { createForgeAPIClient } from 'lifeforge-api'

import type { AppRoutes } from '../../../../server/src/core/appRoutes.type'

const forgeAPI = createForgeAPIClient<AppRoutes>()

export default forgeAPI
