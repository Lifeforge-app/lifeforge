import {
  CleanedSchemas,
  CollectionKey,
  IPBService
} from '@lifeforge/server-utils'

const checkExistence = async <TSchemas extends CleanedSchemas>(
  pb: IPBService<TSchemas>,
  collection: CollectionKey<TSchemas>,
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
