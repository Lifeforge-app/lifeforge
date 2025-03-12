import type BasePBCollection from '@interfaces/pb_interfaces'

interface IWalletAsset extends BasePBCollection {
  name: string
  icon: string
  balance: number
  starting_balance: number
}

interface IWalletLedger extends BasePBCollection {
  name: string
  icon: string
  color: string
}

interface IWalletCategory extends IWalletLedger {
  type: 'income' | 'expenses'
}

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
  IWalletCategory,
  IWalletIncomeExpenses,
  IWalletLedger,
  IWalletTransaction,
  IWalletReceiptScanResult
}
