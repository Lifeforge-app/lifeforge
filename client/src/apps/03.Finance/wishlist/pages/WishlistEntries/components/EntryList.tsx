import { EmptyStateScreen, Scrollbar, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import type { WishlistEntry } from '..'
import ModifyEntryModal from '../modals/ModifyEntryModal'
import EntryItem from './EntryItem'

function EntryList({
  filteredEntries,
  isTotallyEmpty
}: {
  filteredEntries: WishlistEntry[]
  isTotallyEmpty: boolean
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wishlist')

  if (isTotallyEmpty) {
    return (
      <EmptyStateScreen
        CTAButtonProps={{
          children: 'new',
          onClick: () => {
            open(ModifyEntryModal, {
              type: 'create'
            })
          },
          tProps: { item: t('items.entry') },
          icon: 'tabler:plus'
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
