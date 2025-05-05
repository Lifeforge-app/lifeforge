import { type ModalComponent } from '@lifeforge/ui'

import AdjustBgImageModal from './AdjustBgImageModal'

export const personalizationBgImageSelectorModals: Record<
  string,
  ModalComponent
> = {
  'personalization.bgImageSelector.adjustBgImage': AdjustBgImageModal
}
