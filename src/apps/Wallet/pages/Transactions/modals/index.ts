import { type ModalComponent } from '@lifeforge/ui'

import ViewReceiptModal from '../views/ListView/components/ViewReceiptModal'
import ManageCategoriesModal from './ManageCategoriesModal'
import ModifyCategory from './ModifyCategoryModal'
import ModifyTransactionsModal from './ModifyTransactionsModal'
import ScanReceiptModal from './ScanReceiptModal'
import ViewTransactionModal from './ViewTransactionModal'

export const walletTransactionsModals: Record<string, ModalComponent> = {
  'wallet.transactions.viewTransaction': ViewTransactionModal,
  'wallet.transactions.manageCategories': ManageCategoriesModal,
  'wallet.transactions.modifyCategory': ModifyCategory,
  'wallet.transactions.modifyTransaction': ModifyTransactionsModal,
  'wallet.transactions.scanReceipt': ScanReceiptModal,
  'wallet.transactions.viewReceipt': ViewReceiptModal
}
