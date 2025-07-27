import { getPBSuperUserInstance } from '@functions/database'
import { forgeController, forgeRouter } from '@functions/routes'
import moment from 'moment'
import { z } from 'zod/v4'

const list = forgeController.query
  .description('List all backups')
  .input({})
  .callback(async () => {
    const pb = await getPBSuperUserInstance()

    const allBackups = await pb.backups.getFullList()

    return allBackups.sort((a, b) => b.modified.localeCompare(a.modified)) as {
      key: string
      size: number
      modified: string
    }[]
  })

const download = forgeController.query
  .description('Download a specific backup')
  .input({
    query: z.object({
      key: z.string()
    })
  })
  .isDownloadable()
  .callback(async ({ res, query: { key } }) => {
    const pb = await getPBSuperUserInstance()

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

    // @ts-expect-error - custom response type
    res.send(buffer)
  })

const create = forgeController.mutation
  .description('Create a new backup')
  .input({
    body: z.object({
      backupName: z.string().optional()
    })
  })
  .statusCode(201)
  .callback(async ({ body: { backupName } }) => {
    const pb = await getPBSuperUserInstance()

    if (!backupName) {
      backupName = `pb_backup_lifeforge_${moment().format('YYYYMMDD_HHmmss')}.zip`
    }

    await pb.backups.create(backupName)
  })

const remove = forgeController.mutation
  .description('Delete a specific backup')
  .input({
    query: z.object({
      key: z.string()
    })
  })
  .statusCode(204)
  .callback(async ({ query: { key } }) => {
    const pb = await getPBSuperUserInstance()

    await pb.backups.delete(key)
  })

export default forgeRouter({
  list,
  download,
  create,
  remove
})
