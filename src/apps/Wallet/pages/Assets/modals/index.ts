import { type ModalComponent } from '@lifeforge/ui'

import BalanceChartModal from './BalanceChartModal'
import ModifyAssetModal from './ModifyAssetModal'

export const walletAssetsModals: Record<string, ModalComponent> = {
  'wallet.assets.modifyAsset': ModifyAssetModal,
  'wallet.assets.balanceChart': BalanceChartModal
}
