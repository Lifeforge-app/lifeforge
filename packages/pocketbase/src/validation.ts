import { CleanedSchemas, CollectionKey } from './types/pb_service.types'
import { IPBService } from './types/service.interface'

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
