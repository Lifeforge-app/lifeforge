import COLLECTION_SCHEMAS from '@schema'

import PBService from './PBService'

const checkExistence = async (
  pb: PBService,
  collection: keyof typeof COLLECTION_SCHEMAS,
  id: string
): Promise<boolean> => {
  try {
    await pb.getOne.collection(collection).id(id).execute()

    return true
  } catch {
    return false
  }
}

export default checkExistence
