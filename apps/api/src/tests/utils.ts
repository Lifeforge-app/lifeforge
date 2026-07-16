import type { AxiosResponse } from 'axios'
import PocketBase from 'pocketbase'

import {
  contract,
  type ResponseWrapper,
  createForgeProxy,
  globalProxyRegistry
} from '@lifeforge/api'

globalProxyRegistry.set(contract, {
  moduleId: '',
  apiHost: 'http://localhost:3636'
})

export const forgeAPI = createForgeProxy(contract)

export function extractCookies(
  setCookie: string | string[] | null | undefined
): string {
  const header = Array.isArray(setCookie)
    ? (setCookie[0] ?? '')
    : (setCookie ?? '')

  if (!header) return ''

  const match = header.match(/refresh_token=([^;]+)/)

  return match ? `refresh_token=${match[1]}` : ''
}

export function unwrap<T>(res: AxiosResponse<ResponseWrapper<T>>): T {
  if (res.data.state === 'error') throw new Error(res.data.message)

  return res.data.data
}

export function expectNo2FA<T>(data: T): T extends { state: string } ? never : T {
  if (data && typeof data === 'object' && 'state' in data) {
    throw new Error('Unexpected 2FA response in test')
  }

  return data as any
}

let pbInstance: PocketBase | null = null

export async function authenticateSuperuser(
  pbHost: string,
  email: string,
  password: string
): Promise<PocketBase> {
  const pb = new PocketBase(pbHost)
  pb.autoCancellation(false)

  await pb.collection('_superusers').authWithPassword(email, password)

  pbInstance = pb

  return pb
}

export function getPB(): PocketBase {
  if (!pbInstance) {
    throw new Error('PB not authenticated. Call authenticateSuperuser() first.')
  }

  return pbInstance
}
