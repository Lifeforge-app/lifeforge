import EntryItem from './EntryItem'

function EntryList({
  filteredEntries,
  isTotallyEmpty,
  queryKey
}: {
  filteredEntries: ISchemaWithPB<WishlistCollectionsSchemas.IEntry>[]
  isTotallyEmpty: boolean
  queryKey: unknown[]
}) {
  const { t } = useTranslation('apps.wishlist')

  if (!isTotallyEmpty) {
    return (
      <EmptyStateScreen
        ctaContent="new"
        ctaTProps={{
          item: t('items.entry')
        }}
        icon="tabler:shopping-cart-off"
        name="entries"
        namespace="apps.wishlist"
      />
    )
  }

  if (!filteredEntries?.length) {
    return (
      <EmptyStateScreen
        icon="tabler:search-off"
        name="search"
        namespace="apps.wishlist"
      />
    )
  }

  return (
    <Scrollbar>
      <ul className="mb-14 flex flex-col space-y-2 sm:mb-6">
        {filteredEntries.map(entry => (
          <EntryItem key={entry.id} entry={entry} queryKey={queryKey} />
        ))}
      </ul>
    </Scrollbar>
  )
}

export default EntryList
