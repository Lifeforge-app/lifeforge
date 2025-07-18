import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { BlogControllersSchemas } from 'shared/types/controllers'

const blogEntriesRouter = express.Router()

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all blog entries')
  .schema(BlogControllersSchemas.Entries.getAllEntries)
  .callback(({ pb }) => pb.collection('blog__entries').getFullList())

bulkRegisterControllers(blogEntriesRouter, [getAllEntries])

export default blogEntriesRouter
