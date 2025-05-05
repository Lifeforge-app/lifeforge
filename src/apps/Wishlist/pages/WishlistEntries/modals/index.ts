import { type ModalComponent } from '@lifeforge/ui'

import FromOtherAppsModal from './FromOtherAppsModal'
import ModifyEntryModal from './ModifyEntryModal'

export const wishlistEntriesModals: Record<string, ModalComponent> = {
  'wishlist.entries.modifyEntry': ModifyEntryModal,
  'wishlist.entries.fromOtherApps': FromOtherAppsModal
}
