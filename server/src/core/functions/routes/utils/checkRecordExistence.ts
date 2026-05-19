/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientError } from '@lifeforge/server-utils'
import { Request } from 'express'

import { PBService, checkExistence, checkExistenceBatch } from '@functions/database'

interface ExistenceCheckConfig {
  [key: string]: string
}

interface ExistenceCheckOptions {
  body?: ExistenceCheckConfig
  query?: ExistenceCheckConfig
}

async function checkSingle(
  pb: PBService<any>,
  collection: string,
  val: string
): Promise<boolean> {
  return await checkExistence(
    pb,
    collection.replace(/\^?\[(.*)\]$/, '$1') as never,
    val
  )
}

async function checkBatch(
  pb: PBService<any>,
  collection: string,
  values: string[]
): Promise<boolean> {
  const cleanCollection = collection.replace(/\^?\[(.*)\]$/, '$1')
  const existingIds = await checkExistenceBatch(
    pb,
    cleanCollection as never,
    values
  )
  return values.every(id => existingIds.has(id))
}

export default async function checkRecordExistence({
  type,
  req,
  existenceCheck,
  module
}: {
  type: 'body' | 'query'
  req: Request
  existenceCheck: ExistenceCheckOptions
  module: { id: string }
}): Promise<void> {
  if (!existenceCheck?.[type]) return

  const checks = Object.entries(existenceCheck[type]!) as [string, string][]

  for (const [key, collection] of checks) {
    const optional = collection.match(/\^?\[(.*)\]$/)

    const value = req[type][key]

    if (optional && !value) continue

    let isValid = true

    if (Array.isArray(value) && value.length > 0) {
      // Use batch check for arrays (N+1 optimization)
      isValid = await checkBatch(req.pb(module), collection, value)
    } else if (typeof value === 'string') {
      isValid = await checkSingle(req.pb(module), collection, value)
    } else if (value !== undefined && value !== null) {
      // Handle other types - convert to string
      isValid = await checkSingle(req.pb(module), collection, String(value))
    }

    if (!isValid) {
      throw new ClientError(
        `Invalid ${type} field "${key}" with value "${value}" does not exist in collection "${collection}"`
      )
    }
  }
}
