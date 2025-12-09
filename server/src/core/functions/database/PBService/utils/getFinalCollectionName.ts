export default function getFinalCollectionName(collectionKey: string) {
  if (collectionKey === 'user__users') {
    return 'users'
  }

  return collectionKey
}
