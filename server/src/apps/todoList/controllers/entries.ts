import {
  forgeController
} from '@functions/forgeController'
import forgeRouter from '@functions/forgeRouter'

import { TodoListControllersSchemas } from 'shared/types/controllers'

import * as entriesService from '../services/entries.service'

const getStatusCounter = forgeController
  .route('GET /utils/status-counter')
  .description('Get status counter for todo entries')
  .schema(TodoListControllersSchemas.Entries.getStatusCounter)
  .callback(async ({ pb }) => await entriesService.getStatusCounter(pb))

const getEntryById = forgeController
  .route('GET /:id')
  .description('Get todo entry by ID')
  .schema(TodoListControllersSchemas.Entries.getEntryById)
  .existenceCheck('params', {
    id: 'todo_list__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await entriesService.getEntryById(pb, id)
  )

const getAllEntries = forgeController
  .route('GET /')
  .description('Get all todo entries with optional filters')
  .schema(TodoListControllersSchemas.Entries.getAllEntries)
  .existenceCheck('query', {
    tag: '[todo_list__tags]',
    list: '[todo_list__lists]',
    priority: '[todo_list__priorities]'
  })
  .callback(
    async ({ pb, query: { status, tag, list, priority } }) =>
      await entriesService.getAllEntries(pb, status, tag, list, priority)
  )

const createEntry = forgeController
  .route('POST /')
  .description('Create a new todo entry')
  .schema(TodoListControllersSchemas.Entries.createEntry)
  .existenceCheck('body', {
    list: '[todo_list__lists]',
    priority: '[todo_list__priorities]',
    tags: '[todo_list__tags]'
  })
  .statusCode(201)
  .callback(async ({ pb, body }) => await entriesService.createEntry(pb, body))

const updateEntry = forgeController
  .route('PATCH /:id')
  .description('Update an existing todo entry')
  .schema(TodoListControllersSchemas.Entries.updateEntry)
  .existenceCheck('params', {
    id: 'todo_list__entries'
  })
  .existenceCheck('body', {
    list: '[todo_list__lists]',
    priority: '[todo_list__priorities]',
    tags: '[todo_list__tags]'
  })
  .callback(
    async ({ pb, params: { id }, body }) =>
      await entriesService.updateEntry(pb, id, body)
  )

const deleteEntry = forgeController
  .route('DELETE /:id')
  .description('Delete a todo entry')
  .schema(TodoListControllersSchemas.Entries.deleteEntry)
  .existenceCheck('params', {
    id: 'todo_list__entries'
  })
  .statusCode(204)
  .callback(
    async ({ pb, params: { id } }) => await entriesService.deleteEntry(pb, id)
  )

const toggleEntry = forgeController
  .route('POST /toggle/:id')
  .description('Toggle completion status of a todo entry')
  .schema(TodoListControllersSchemas.Entries.toggleEntry)
  .existenceCheck('params', {
    id: 'todo_list__entries'
  })
  .callback(
    async ({ pb, params: { id } }) => await entriesService.toggleEntry(pb, id)
  )

export default forgeRouter({
  getEntryById,
  getAllEntries,
  getStatusCounter,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleEntry
})
