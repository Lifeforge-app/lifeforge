import { ModalComponent } from '../../../../../core/modals/useModalStore'
import ManageCategoriesModal from './ManageCategoriesModal'
import ModifyCategory from './ModifyCategoryModal'
import ModifyTransactionsModal from './ModifyTransactionsModal'
import ScanReceiptModal from './ScanReceiptModal'

export const walletTransactionsModals: Record<string, ModalComponent> = {
  'wallet.transactions.manageCategories': ManageCategoriesModal,
  'wallet.transactions.modifyCategory': ModifyCategory,
  'wallet.transactions.modifyTransaction': ModifyTransactionsModal,
  'wallet.transactions.scanReceipt': ScanReceiptModal
}
