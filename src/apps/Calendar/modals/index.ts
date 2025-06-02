import { type ModalComponent } from '@lifeforge/ui'

import ModifyCalendarModal from './ModifyCalendarModal'
import ModifyCategoryModal from './ModifyCategoryModal'
import ModifyEventModal from './ModifyEventModal'
import ScanImageModal from './ScanImageModal'

export const calendarModals: Record<string, ModalComponent> = {
  'calendar.modifyEvent': ModifyEventModal,
  'calendar.modifyCalendar': ModifyCalendarModal,
  'calendar.modifyCategory': ModifyCategoryModal,
  'calendar.scanImage': ScanImageModal
}
