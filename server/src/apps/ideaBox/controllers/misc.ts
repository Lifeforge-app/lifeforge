import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import * as miscService from '../services/misc.service'

const getPath = forgeController
  .route('GET /path/:container/*')
  .description('Get path information for a container')
  .input({})
  .callback(async ({ pb, params: { container, '0': pathParam }, req, res }) => {
    const result = await miscService.getPath(
      pb,
      container,
      pathParam.split('/').filter(p => p !== ''),
      req,
      res
    )

    if (!result) {
      throw new Error('Something went wrong while fetching the path')
    }

    return result
  })

const checkValid = forgeController
  .route('GET /valid/:container/*')
  .description('Check if a path is valid')
  .input({})
  .callback(
    async ({ pb, params: { container, '0': pathParam }, req, res }) =>
      await miscService.checkValid(
        pb,
        container,
        pathParam.split('/').filter(p => p !== ''),
        req,
        res
      )
  )

const getOgData = forgeController
  .route('GET /og-data/:id')
  .description('Get Open Graph data for an entry')
  .input({})
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await miscService.getOgData(pb, id)
  )

const search = forgeController
  .route('GET /search')
  .description('Search entries')
  .input({})
  .existenceCheck('query', {
    container: '[idea_box_containers]'
  })
  .callback(async ({ pb, query: { q, container, tags, folder }, req, res }) => {
    const results = await miscService.search(
      pb,
      q,
      container || '',
      tags || '',
      folder || '',
      req,
      res
    )

    return results || []
  })

export default forgeRouter({
  getPath,
  checkValid,
  getOgData,
  search
})
