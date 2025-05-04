import { ModalComponent } from '../../../../../modals/useModalStore'
import AdjustBgImageModal from './AdjustBgImageModal'

export const personalizationBgImageSelectorModals: Record<
  string,
  ModalComponent
> = {
  'personalization.bgImageSelector.adjustBgImage': AdjustBgImageModal
}
