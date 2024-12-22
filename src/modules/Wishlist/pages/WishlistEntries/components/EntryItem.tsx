import React from 'react'
import { type IWishlistEntry } from '@interfaces/wishlist_interfaces'

function EntryItem({ entry }: { entry: IWishlistEntry }): React.ReactElement {
  return <div>{entry.name}</div>
}

export default EntryItem
