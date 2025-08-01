import { createForgeAPIClient } from 'shared'

import type { AppRoutes } from '../../../../server/src/core/routes/routes.type'

const forgeAPI = createForgeAPIClient<AppRoutes>()

export default forgeAPI
