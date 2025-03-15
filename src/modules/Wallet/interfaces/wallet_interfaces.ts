import type BasePBCollection from '@interfaces/pb_interfaces'

interface IWalletAsset extends BasePBCollection {
  name: string
  icon: string
  balance: number
  starting_balance: number
}

type IWalletAssetFormState = {
  name: string
  icon: string
  starting_balance: string
}

interface IWalletLedger extends BasePBCollection {
  name: string
  icon: string
  color: string
}

type IWalletLedgerFormState = Omit<IWalletLedger, keyof BasePBCollection>

interface IWalletCategory extends IWalletLedger {
  type: 'income' | 'expenses'
}

type IWalletCategoryFormState = Omit<IWalletCategory, keyof BasePBCollection>

interface IWalletTransaction extends BasePBCollection {
  type: 'income' | 'expenses' | 'transfer'
  side: 'debit' | 'credit'
  particulars: string
  amount: number
  location: string
  date: string
  category: string
  asset: string
  ledger: string
  receipt: string | File
}

interface IWalletIncomeExpenses {
  totalIncome: number
  totalExpenses: number
  monthlyIncome: number
  monthlyExpenses: number
}

interface IWalletReceiptScanResult {
  date: string
  particulars: string
  type: 'income' | 'expenses'
  amount: number
}

export type {
  IWalletAsset,
  IWalletAssetFormState,
  IWalletCategory,
  IWalletCategoryFormState,
  IWalletIncomeExpenses,
  IWalletLedger,
  IWalletLedgerFormState,
  IWalletTransaction,
  IWalletReceiptScanResult
}
