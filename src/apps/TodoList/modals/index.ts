import { type ModalComponent } from '@lifeforge/ui'

import ModifyListModal from './ModifyListModal'
import ModifyPriorityModal from './ModifyPriorityModal'
import ModifyTagModal from './ModifyTagModal'

export const todoListModals: Record<string, ModalComponent> = {
  'todoList.modifyList': ModifyListModal,
  'todoList.modifyPriority': ModifyPriorityModal,
  'todoList.modifyTag': ModifyTagModal
}
