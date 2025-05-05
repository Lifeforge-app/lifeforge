import { type ModalComponent } from '@lifeforge/ui'

import ModifyFolderModal from './ModifyFolderModal'
import ModifyIdeaModal from './ModifyIdeaModal'
import ModifyTagModal from './ModifyTagModal'

export const ideaBoxIdeasModals: Record<string, ModalComponent> = {
  'ideaBox.ideas.modifyIdea': ModifyIdeaModal,
  'ideaBox.ideas.modifyFolder': ModifyFolderModal,
  'ideaBox.ideas.modifyTag': ModifyTagModal
}
