import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { BooksLibraryControllersSchemas } from 'shared/types/controllers'

import * as FileTypesService from '../services/fileTypes.service'

const booksLibraryFileTypesRouter = express.Router()

const getAllFileTypes = forgeController
  .route('GET /')
  .description('Get all file types for the books library')
  .schema(BooksLibraryControllersSchemas.FileTypes.getAllFileTypes)
  .callback(async ({ pb }) => await FileTypesService.getAllFileTypes(pb))

bulkRegisterControllers(booksLibraryFileTypesRouter, [getAllFileTypes])

export default booksLibraryFileTypesRouter
