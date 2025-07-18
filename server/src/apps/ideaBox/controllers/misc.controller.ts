import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

import * as miscService from '../services/misc.service'

const ideaBoxMiscRouter = express.Router()

const getPath = forgeController
  .route('GET /path/:container/*')
  .description('Get path information for a container')
  .schema(IdeaBoxControllersSchemas.Misc.getPath)
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
  .schema(IdeaBoxControllersSchemas.Misc.checkValid)
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
  .schema(IdeaBoxControllersSchemas.Misc.getOgData)
  .existenceCheck('params', {
    id: 'idea_box__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await miscService.getOgData(pb, id)
  )

const search = forgeController
  .route('GET /search')
  .description('Search entries')
  .schema(IdeaBoxControllersSchemas.Misc.search)
  .existenceCheck('query', {
    container: '[idea_box_containers]'
  })
  .callback(
    async ({ pb, query: { q, container, tags, folder }, req, res }) =>
      await miscService.search(
        pb,
        q,
        container || '',
        tags || '',
        folder || '',
        req,
        res
      )
  )

bulkRegisterControllers(ideaBoxMiscRouter, [
  getPath,
  checkValid,
  getOgData,
  search
])

export default ideaBoxMiscRouter
