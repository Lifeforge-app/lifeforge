import Pocketbase from 'pocketbase'

import { decrypt2 } from './encryption'

export async function getAPIKey(id: string, pb: Pocketbase) {
  try {
    const { key } = await pb
      .collection('api_keys__entries')
      .getFirstListItem(`keyId = "${id}"`)

    return decrypt2(key, process.env.MASTER_KEY!)
  } catch (e) {
    return null
  }
}
