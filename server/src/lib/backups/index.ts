import moment from 'moment'
import z from 'zod'

import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@functions/database/dbUtils'
import { forgeController, forgeRouter } from '@functions/routes'

const list = forgeController
  .query()
  .description({
    en: 'Retrieve all database backups',
    ms: 'Dapatkan semua sandaran pangkalan data',
    'zh-CN': '获取所有数据库备份',
    'zh-TW': '獲取所有資料庫備份'
  })
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

const download = forgeController
  .query()
  .description({
    en: 'Download a database backup file',
    ms: 'Muat turun fail sandaran pangkalan data',
    'zh-CN': '下载数据库备份文件',
    'zh-TW': '下載資料庫備份文件'
  })
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

    // @ts-expect-error - custom response type
    res.send(buffer)
  })

const create = forgeController
  .mutation()
  .description({
    en: 'Create a new database backup',
    ms: 'Cipta sandaran pangkalan data baharu',
    'zh-CN': '创建新的数据库备份',
    'zh-TW': '創建新的資料庫備份'
  })
  .input({
    body: z.object({
      backupName: z.string().optional()
    })
  })
  .statusCode(201)
  .callback(async ({ body: { backupName } }) => {
    const pb = await connectToPocketBase(validateEnvironmentVariables())

    if (!backupName) {
      backupName = `pb_backup_lifeforge_${moment().format('YYYYMMDD_HHmmss')}.zip`
    }

    await pb.backups.create(backupName)
  })

const remove = forgeController
  .mutation()
  .description({
    en: 'Delete a database backup',
    ms: 'Padam sandaran pangkalan data',
    'zh-CN': '删除数据库备份',
    'zh-TW': '刪除資料庫備份'
  })
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
