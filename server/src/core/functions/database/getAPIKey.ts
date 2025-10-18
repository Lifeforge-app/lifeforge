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
      .catch(err => {
        throw new Error(err.message)
      })

    try {
      return decrypt2(key, process.env.MASTER_KEY!)
    } catch (err) {
      throw new Error(`Failed to decrypt API key for ${id}.`)
    }
  } catch (err) {
    throw new Error(
      `Failed to retrieve API key for ${id}: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}
