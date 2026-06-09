import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import dayjs from 'dayjs'
import z from 'zod'

import { createForge, forgeRouter } from '@lifeforge/server-utils'

const forge = createForge({}, 'backups')

const list = forge
  .query({
    description: 'Retrieve all database backups',
    input: {},
    output: {
      OK: z.array(
        z.object({
          key: z.string(),
          size: z.number(),
          modified: z.string()
        })
      )
    }
  })
  .callback(async ({ response }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    const allBackups = await pb.backups.getFullList()

    return response.ok(
      allBackups.sort((a, b) => b.modified.localeCompare(a.modified)) as {
        key: string
        size: number
        modified: string
      }[]
    )
  })

const download = forge
  .query({
    description: 'Download a database backup file',
    input: {
      query: z.object({
        key: z.string()
      })
    },
    isDownloadable: true,
    output: {
      NO_CONTENT: true,
      BAD_REQUEST: z.string()
    }
  })
  .callback(async ({ res, query: { key }, response }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    const token = await pb.files.getToken()

    const downloadURL = pb.backups.getDownloadURL(token, key)

    const r = await fetch(downloadURL)

    if (!r.ok) {
      return response.badRequest(`Failed to download backup: ${r.statusText}`)
    }

    const buffer = Buffer.from(await r.arrayBuffer())

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="${key}.zip"`)
    res.setHeader('Content-Length', buffer.length)

    res.send(buffer)

    return response.noContent()
  })

const create = forge
  .mutation({
    description: 'Create a new database backup',
    input: {
      body: z.object({
        backupName: z.string().optional()
      })
    },
    output: {
      CREATED: z.null()
    }
  })
  .callback(async ({ body: { backupName }, response }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    if (!backupName) {
      backupName = `pb_backup_lifeforge_${dayjs().format('YYYYMMDD_HHmmss')}.zip`
    }

    await pb.backups.create(backupName)

    return response.created(null)
  })

const remove = forge
  .mutation({
    description: 'Delete a database backup',
    input: {
      query: z.object({
        key: z.string()
      })
    },
    output: {
      NO_CONTENT: true
    }
  })
  .callback(async ({ query: { key }, response }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    await pb.backups.delete(key)

    return response.noContent()
  })

export default forgeRouter({
  list,
  download,
  create,
  remove
})
