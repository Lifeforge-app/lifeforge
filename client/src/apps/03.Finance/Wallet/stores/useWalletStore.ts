import { create } from 'zustand'

import type { WalletTransaction } from '../pages/Transactions'

interface WalletState {
  selectedType: WalletTransaction['type'] | null
  selectedCategory: string | null
  selectedAsset: string | null
  selectedLedger: string | null
  startDate: string | undefined
  endDate: string | undefined
  searchQuery: string
  nextToSelect: 'start' | 'end'
  isAmountHidden: boolean

  // actions
  setSelectedType: (t: WalletState['selectedType']) => void
  setSelectedCategory: (c: string | null) => void
  setSelectedAsset: (a: string | null) => void
  setSelectedLedger: (l: string | null) => void
  setStartDate: (d: string | undefined) => void
  setEndDate: (d: string | undefined) => void
  setSearchQuery: (q: string) => void
  setNextToSelect: (s: WalletState['nextToSelect']) => void
  toggleAmountVisibility: () => void
}

export const useWalletStore = create<WalletState>()(set => ({
  selectedType: null,
  selectedCategory: null,
  selectedAsset: null,
  selectedLedger: null,
  startDate: undefined,
  endDate: undefined,
  searchQuery: '',
  nextToSelect: 'start',
  isAmountHidden: true,

  setSelectedType: t => set({ selectedType: t }),
  setSelectedCategory: c => set({ selectedCategory: c }),
  setSelectedAsset: a => set({ selectedAsset: a }),
  setSelectedLedger: l => set({ selectedLedger: l }),
  setStartDate: d => set({ startDate: d }),
  setEndDate: d => set({ endDate: d }),
  setSearchQuery: q => set({ searchQuery: q }),
  setNextToSelect: s => set({ nextToSelect: s }),
  toggleAmountVisibility: () =>
    set(state => ({ isAmountHidden: !state.isAmountHidden }))
}))
