import type { RecordModel } from 'pocketbase'

interface IWalletAsset extends RecordModel {
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

interface IWalletLedger extends RecordModel {
  name: string
  icon: string
  color: string
}

type IWalletLedgerFormState = {
  name: string
  icon: string
  color: string
}

interface IWalletCategory extends IWalletLedger {
  type: 'income' | 'expenses'
}

type IWalletCategoryFormState = {
  name: string
  icon: string
  color: string
  type: 'income' | 'expenses'
}

interface IWalletTransaction extends RecordModel {
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
