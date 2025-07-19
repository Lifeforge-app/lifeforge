import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { ScoresLibraryControllersSchemas } from 'shared/types/controllers'

import * as guitarWorldService from '../services/guitarWorld.service'

const scoresLibraryGuitarWorldRouter = express.Router()

const getTabsList = forgeController
  .route('GET /')
  .description('Get tabs list from Guitar World')
  .schema(ScoresLibraryControllersSchemas.GuitarWorld.getTabsList)
  .callback(
    async ({ query: { cookie, page } }) =>
      await guitarWorldService.getTabsList(cookie, page)
  )

const downloadTab = forgeController
  .route('POST /download')
  .description('Download a guitar tab from Guitar World')
  .schema(ScoresLibraryControllersSchemas.GuitarWorld.downloadTab)
  .statusCode(202)
  .callback(
    async ({ pb, body, io }) =>
      await guitarWorldService.downloadTab(io, pb, body)
  )

bulkRegisterControllers(scoresLibraryGuitarWorldRouter, [
  getTabsList,
  downloadTab
])

export default scoresLibraryGuitarWorldRouter
