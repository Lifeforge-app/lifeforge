import { default as userSchema } from '@lib/user/schema'
import type PocketBase from 'pocketbase'

import {
  IPBService,
  PBService,
  connectToPocketBase,
  validateEnvironmentVariables
} from '@lifeforge/pocketbase'

import { default as selfSchema } from '../schema'

type SchemaType = 'self' | 'user'

type SelfPBInstance = IPBService<typeof selfSchema>

type UserPBInstance = IPBService<typeof userSchema>

let pbInstance: PocketBase | null = null

export async function getPB(type?: 'self'): Promise<SelfPBInstance>

export async function getPB(type: 'user'): Promise<UserPBInstance>

export async function getPB(
  type: SchemaType = 'self'
): Promise<SelfPBInstance | UserPBInstance> {
  if (!pbInstance) {
    pbInstance = await connectToPocketBase(validateEnvironmentVariables())
  }

  if (type === 'self') {
    return new PBService<typeof selfSchema>(pbInstance, {
      id: 'auth'
    })
  }

  return new PBService<typeof userSchema>(pbInstance, {
    id: 'user'
  })
}
