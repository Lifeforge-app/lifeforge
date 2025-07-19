import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { GuitarTabsControllersSchemas } from 'shared/types/controllers'

import * as guitarWorldService from '../services/guitarWorld.service'

const guitarTabsGuitarWorldRouter = express.Router()

const getTabsList = forgeController
  .route('GET /')
  .description('Get tabs list from Guitar World')
  .schema(GuitarTabsControllersSchemas.GuitarWorld.getTabsList)
  .callback(
    async ({ body: { cookie, page } }) =>
      await guitarWorldService.getTabsList(cookie, page)
  )

const downloadTab = forgeController
  .route('POST /download')
  .description('Download a guitar tab from Guitar World')
  .schema(GuitarTabsControllersSchemas.GuitarWorld.downloadTab)
  .statusCode(202)
  .callback(
    async ({ pb, body, io }) =>
      await guitarWorldService.downloadTab(io, pb, body)
  )

bulkRegisterControllers(guitarTabsGuitarWorldRouter, [getTabsList, downloadTab])

export default guitarTabsGuitarWorldRouter
