export default function getFinalCollectionName(collectionKey: string) {
  if (collectionKey === 'users') {
    return 'users'
  }

  return collectionKey
}
