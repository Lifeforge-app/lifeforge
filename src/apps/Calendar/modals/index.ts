import { type ModalComponent } from '@lifeforge/ui'

import ModifyCategoryModal from './ModifyCategoryModal'
import ModifyEventModal from './ModifyEventModal'
import ScanImageModal from './ScanImageModal'

export const calendarModals: Record<string, ModalComponent> = {
  'calendar.modifyEvent': ModifyEventModal,
  'calendar.modifyCategory': ModifyCategoryModal,
  'calendar.scanImage': ScanImageModal
}
