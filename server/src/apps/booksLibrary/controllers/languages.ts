import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { BooksLibraryControllersSchemas } from 'shared/types/controllers'

import * as LanguagesService from '../services/languages.service'

const getAllLanguages = forgeController
  .route('GET /')
  .description('Get all languages for the books library')
  .schema(BooksLibraryControllersSchemas.Languages.getAllLanguages)
  .callback(({ pb }) => LanguagesService.getAllLanguages(pb))

const createLanguage = forgeController
  .route('POST /')
  .description('Create a new language for the books library')
  .schema(BooksLibraryControllersSchemas.Languages.createLanguage)
  .statusCode(201)
  .callback(
    async ({ pb, body }) => await LanguagesService.createLanguage(pb, body)
  )

const updateLanguage = forgeController
  .route('PATCH /:id')
  .description('Update an existing language for the books library')
  .schema(BooksLibraryControllersSchemas.Languages.updateLanguage)
  .existenceCheck('params', {
    id: 'books_library__languages'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await LanguagesService.updateLanguage(pb, id, body)
  )

const deleteLanguage = forgeController
  .route('DELETE /:id')
  .description('Delete an existing language for the books library')
  .schema(BooksLibraryControllersSchemas.Languages.deleteLanguage)
  .existenceCheck('params', {
    id: 'books_library__languages'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) =>
      await LanguagesService.deleteLanguage(pb, id)
  )

export default forgeRouter({
  getAllLanguages,
  createLanguage,
  updateLanguage,
  deleteLanguage
})
