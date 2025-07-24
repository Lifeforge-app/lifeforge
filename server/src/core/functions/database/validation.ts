import COLLECTION_SCHEMAS from '@schema'

import PBService from './PBService'

const checkExistence = async (
  pb: PBService,
  collection: keyof typeof COLLECTION_SCHEMAS,
  id: string
): Promise<boolean> =>
  (await pb.getOne
    .collection(collection)
    .id(id)
    .execute()
    .then(() => true)
    .catch(() => {})) ?? false

export default checkExistence
