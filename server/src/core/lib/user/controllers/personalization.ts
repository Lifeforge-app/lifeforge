import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'
import { singleUploadMiddleware } from '@middlewares/uploadMiddleware'

import { UserControllersSchemas } from 'shared/types/controllers'

import * as PersonalizationService from '../services/personalization.service'

const listGoogleFonts = forgeController
  .route('GET /fonts')
  .description('List available Google Fonts')
  .schema(UserControllersSchemas.Personalization.listGoogleFonts)
  .callback(async ({ pb }) => PersonalizationService.listGoogleFonts(pb))

const getGoogleFont = forgeController
  .route('GET /font')
  .description('Get specific Google Font details')
  .schema(UserControllersSchemas.Personalization.getGoogleFont)
  .callback(async ({ pb, query: { family } }) =>
    PersonalizationService.getGoogleFont(pb, family)
  )

const updateBgImage = forgeController
  .route('PUT /bg-image')
  .description('Update background image')
  .schema(UserControllersSchemas.Personalization.updateBgImage)
  .middlewares(singleUploadMiddleware)
  .callback(async ({ pb, body: { url }, req }) =>
    PersonalizationService.updateBgImage(pb, req.file, url)
  )

const deleteBgImage = forgeController
  .route('DELETE /bg-image')
  .description('Delete background image')
  .schema(UserControllersSchemas.Personalization.deleteBgImage)
  .statusCode(204)
  .callback(
    async ({ pb }) =>
      await PersonalizationService.deleteBgImage(pb, pb.authStore.record!.id)
  )

const updatePersonalization = forgeController
  .route('PATCH /')
  .description('Update personalization settings')
  .schema(UserControllersSchemas.Personalization.updatePersonalization)
  .statusCode(204)
  .callback(
    async ({ pb, body: { data } }) =>
      await PersonalizationService.updatePersonalization(
        pb,
        pb.authStore.record!.id,
        data
      )
  )

export default forgeRouter({
  listGoogleFonts,
  getGoogleFont,
  updateBgImage,
  deleteBgImage,
  updatePersonalization
})
