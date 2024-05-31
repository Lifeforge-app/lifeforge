interface IWalletAssetEntry {
  collectionId: string
  collectionName: string
  created: string
  id: string
  updated: string
  name: string
  icon: string
  balance: string
}

interface IWalletLedgerEntry {
  collectionId: string
  collectionName: string
  created: string
  id: string
  updated: string
  name: string
  icon: string
  color: string
}

export type { IWalletAssetEntry, IWalletLedgerEntry }
