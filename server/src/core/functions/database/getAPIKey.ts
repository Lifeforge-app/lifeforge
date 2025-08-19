import { decrypt2 } from '@functions/auth/encryption'

import PBService from './PBService'

export default async function getAPIKey(id: string, pb: PBService) {
  try {
    const { key } = await pb.getFirstListItem
      .collection('api_keys__entries')
      .filter([
        {
          field: 'keyId',
          operator: '=',
          value: id
        }
      ])
      .execute()

    return decrypt2(key, process.env.MASTER_KEY!)
  } catch {
    throw new Error(`API key with ID ${id} not found`)
  }
}
