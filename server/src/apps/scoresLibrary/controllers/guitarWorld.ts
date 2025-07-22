import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as guitarWorldService from '../services/guitarWorld.service'

const getTabsList = forgeController
  .route('GET /')
  .description('Get tabs list from Guitar World')
  .input({})
  .callback(
    async ({ query: { cookie, page } }) =>
      await guitarWorldService.getTabsList(cookie, page)
  )

const downloadTab = forgeController
  .route('POST /download')
  .description('Download a guitar tab from Guitar World')
  .input({})
  .statusCode(202)
  .callback(
    async ({ pb, body, io }) =>
      await guitarWorldService.downloadTab(io, pb, body)
  )

export default forgeRouter({
  getTabsList,
  downloadTab
})
