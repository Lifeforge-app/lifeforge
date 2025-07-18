import {
  bulkRegisterControllers,
  forgeController
} from '@functions/forgeController'
import express from 'express'

import { BackupsControllersSchemas } from 'shared/types/controllers'

import * as BackupService from '../services/backups.service'

const backupsRouter = express.Router()

const listBackups = forgeController
  .route('GET /')
  .description('List all backups')
  .schema(BackupsControllersSchemas.Backups.listBackups)
  .callback(BackupService.listBackups)

const downloadBackup = forgeController
  .route('GET /download/:key')
  .description('Download a specific backup')
  .schema(BackupsControllersSchemas.Backups.downloadBackup)
  .isDownloadable()
  .callback(async ({ res, params: { key } }) => {
    const buffer = await BackupService.downloadBackup(key)

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="${key}.zip"`)
    res.setHeader('Content-Length', buffer.length)

    // @ts-expect-error - Custom response
    res.send(buffer)
  })

const createBackup = forgeController
  .route('POST /')
  .description('Create a new backup')
  .schema(BackupsControllersSchemas.Backups.createBackup)
  .statusCode(201)
  .callback(async ({ body: { backupName } }) => {
    await BackupService.createBackup(backupName)
  })

const deleteBackup = forgeController
  .route('DELETE /:key')
  .description('Delete a specific backup')
  .schema(BackupsControllersSchemas.Backups.deleteBackup)
  .statusCode(204)
  .callback(({ params: { key } }) => BackupService.deleteBackup(key))

bulkRegisterControllers(backupsRouter, [
  listBackups,
  downloadBackup,
  createBackup,
  deleteBackup
])

export default backupsRouter
