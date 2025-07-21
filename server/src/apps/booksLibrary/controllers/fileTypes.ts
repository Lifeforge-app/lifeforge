import { forgeController } from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { BooksLibraryControllersSchemas } from 'shared/types/controllers'

import * as FileTypesService from '../services/fileTypes.service'

const getAllFileTypes = forgeController
  .route('GET /')
  .description('Get all file types for the books library')
  .schema(BooksLibraryControllersSchemas.FileTypes.getAllFileTypes)
  .callback(async ({ pb }) => await FileTypesService.getAllFileTypes(pb))

export default forgeRouter({ getAllFileTypes })
