import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { LocalesControllersSchemas } from 'shared/types/controllers'

import * as LocalesService from '../services/locales.service'

const localesRouter = express.Router()

const getLocales = forgeController
  .route('GET /:lang/:namespace/:subnamespace')
  .description(
    'Get locales for a specific language, namespace, and subnamespace'
  )
  .schema(LocalesControllersSchemas.Locales.getLocales)
  .callback(async ({ params: { lang, namespace, subnamespace } }) =>
    LocalesService.getLocales(lang, namespace, subnamespace)
  )

bulkRegisterControllers(localesRouter, [getLocales])

export default localesRouter
