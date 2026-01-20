import { createForge, forgeRouter } from '@lifeforge/server-utils'
import dayjs from 'dayjs'
import z from 'zod'

import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'

const forge = createForge({}, 'backups')

const list = forge
  .query()
  .description('Retrieve all database backups')
  .input({})
  .callback(async () => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    const allBackups = await pb.backups.getFullList()

    return allBackups.sort((a, b) => b.modified.localeCompare(a.modified)) as {
      key: string
      size: number
      modified: string
    }[]
  })

const download = forge
  .query()
  .description('Download a database backup file')
  .input({
    query: z.object({
      key: z.string()
    })
  })
  .isDownloadable()
  .callback(async ({ res, query: { key } }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    const token = await pb.files.getToken()

    const downloadURL = pb.backups.getDownloadURL(token, key)

    const response = await fetch(downloadURL)

    if (!response.ok) {
      throw new Error(`Failed to download backup: ${response.statusText}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="${key}.zip"`)
    res.setHeader('Content-Length', buffer.length)

    // @ts-expect-error - res type
    res.send(buffer)
  })

const create = forge
  .mutation()
  .description('Create a new database backup')
  .input({
    body: z.object({
      backupName: z.string().optional()
    })
  })
  .statusCode(201)
  .callback(async ({ body: { backupName } }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    if (!backupName) {
      backupName = `pb_backup_lifeforge_${dayjs().format('YYYYMMDD_HHmmss')}.zip`
    }

    await pb.backups.create(backupName)
  })

const remove = forge
  .mutation()
  .description('Delete a database backup')
  .input({
    query: z.object({
      key: z.string()
    })
  })
  .statusCode(204)
  .callback(async ({ query: { key } }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    await pb.backups.delete(key)
  })

export default forgeRouter({
  list,
  download,
  create,
  remove
})
