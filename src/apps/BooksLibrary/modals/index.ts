import { type ModalComponent } from '@lifeforge/ui'

import AddToLibraryModal from './AddToLibraryModal'
import LibgenModal from './LibgenModal'
import ModifyBookModal from './ModifyBookModal'
import ModifyModal from './ModifyModal'
import SendToKindleModal from './SendToKindleModal'

export const booksLibraryModals: Record<string, ModalComponent> = {
  'booksLibrary.modify': ModifyModal,
  'booksLibrary.modifyBook': ModifyBookModal,
  'booksLibrary.addToLibrary': AddToLibraryModal,
  'booksLibrary.libgen': LibgenModal,
  'booksLibrary.sendToKindle': SendToKindleModal
}
