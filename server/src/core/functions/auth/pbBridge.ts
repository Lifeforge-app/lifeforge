import Pocketbase from 'pocketbase'

import { PBService } from '@functions/database'
import { LoggingService } from '@functions/logging/loggingService'

let cachedSuperuserPB: Pocketbase | null = null
let cachedAuthExpiry: number = 0

export async function getSuperuserPBInstance(): Promise<Pocketbase> {
  const now = Date.now()

  if (cachedSuperuserPB && cachedAuthExpiry > now) {
    return cachedSuperuserPB
  }

  const { PB_HOST, PB_EMAIL, PB_PASSWORD } = process.env

  if (!PB_HOST || !PB_EMAIL || !PB_PASSWORD) {
    throw new Error(
      'Missing required environment variables: PB_HOST, PB_EMAIL, PB_PASSWORD'
    )
  }

  const pb = new Pocketbase(PB_HOST)

  await pb
    .collection('_superusers')
    .authWithPassword(PB_EMAIL, PB_PASSWORD)
    .catch(err => {
      throw new Error('Failed to authenticate as superuser: ' + err.message)
    })

  if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
    throw new Error('Authentication failed: Invalid superuser credentials')
  }

  cachedSuperuserPB = pb
  cachedAuthExpiry = now + 1000 * 60 * 30

  LoggingService.info('Superuser PocketBase session established', 'Auth')

  return pb
}

export async function createPBServiceForUser(): Promise<PBService> {
  const superPB = await getSuperuserPBInstance()

  return new PBService(superPB)
}
