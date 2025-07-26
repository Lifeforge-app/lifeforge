import { EmptyStateScreen, Scrollbar } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import type { WishlistEntry } from '..'
import EntryItem from './EntryItem'

function EntryList({
  filteredEntries,
  isTotallyEmpty
}: {
  filteredEntries: WishlistEntry[]
  isTotallyEmpty: boolean
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
          <EntryItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </Scrollbar>
  )
}

export default EntryList
