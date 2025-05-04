import { ModalComponent } from '../../../core/modals/useModalStore'
import ModifyTicketModal from './ModifyTicketModal'
import SearchTMDBModal from './SearchTMDBModal'
import ShowTicketModal from './ShowTicketModal'

export const moviesModals: Record<string, ModalComponent> = {
  'movies.searchTMDB': SearchTMDBModal,
  'movies.modifyTicket': ModifyTicketModal,
  'movies.showTicket': ShowTicketModal
}
