/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientError } from '@lifeforge/server-sdk'
import { Request } from 'express'

import { PBService, checkExistence } from '@functions/database'

async function check(
  pb: PBService,
  collection: string,
  val: any
): Promise<boolean> {
  return await checkExistence(
    pb,
    collection.replace(/\^?\[(.*)\]$/, '$1') as any,
    val
  )
}

export default async function checkRecordExistence({
  type,
  req,
  existenceCheck
}: {
  type: 'body' | 'query'
  req: Request
  existenceCheck: any
}): Promise<void> {
  if (!existenceCheck?.[type]) return

  for (const [key, collection] of Object.entries(existenceCheck[type]) as [
    string,
    string
  ][]) {
    const optional = collection.match(/\^?\[(.*)\]$/)

    const value = req[type][key]

    if (optional && !value) continue

    let isValid = true

    if (Array.isArray(value)) {
      for (const val of value) {
        if (!(await check(req.pb, collection, val))) {
          isValid = false
          break
        }
      }
    } else {
      isValid = await check(req.pb, collection, value!)
    }

    if (!isValid) {
      throw new ClientError(
        `Invalid ${type} field "${key}" with value "${value}" does not exist in collection "${collection}"`
      )
    }
  }
}
