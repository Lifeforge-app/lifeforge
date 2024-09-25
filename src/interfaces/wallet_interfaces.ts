import type BasePBCollection from '@interfaces/pocketbase_interfaces'

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
  date: string
  category: string
  asset: string
  ledger: string
  receipt: string
}

interface IWalletIncomeExpenses {
  totalIncome: number
  totalExpenses: number
  monthlyIncome: number
  monthlyExpenses: number
}

export type {
  IWalletAsset,
  IWalletCategory,
  IWalletIncomeExpenses,
  IWalletLedger,
  IWalletTransaction
}
