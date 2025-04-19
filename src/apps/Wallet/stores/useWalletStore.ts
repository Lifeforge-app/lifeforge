import { create } from 'zustand'

import type { IWalletTransaction } from '@apps/Wallet/interfaces/wallet_interfaces'

interface WalletState {
  selectedType: IWalletTransaction['type'] | null
  selectedCategory: string | null
  selectedAsset: string | null
  selectedLedger: string | null
  startDate: string | null
  endDate: string | null
  searchQuery: string
  nextToSelect: 'start' | 'end'
  isAmountHidden: boolean
  sidebarOpen: boolean

  isManageCategoriesModalOpen: boolean | 'new'

  // actions
  setSelectedType: (t: WalletState['selectedType']) => void
  setSelectedCategory: (c: string | null) => void
  setSelectedAsset: (a: string | null) => void
  setSelectedLedger: (l: string | null) => void
  setStartDate: (d: string | null) => void
  setEndDate: (d: string | null) => void
  setSearchQuery: (q: string) => void
  setNextToSelect: (s: WalletState['nextToSelect']) => void
  toggleAmountVisibility: () => void
  setSidebarOpen: (s: boolean) => void

  setManageCategoriesModalOpen: (s: boolean | 'new') => void
}

export const useWalletStore = create<WalletState>()(set => ({
  selectedType: null,
  selectedCategory: null,
  selectedAsset: null,
  selectedLedger: null,
  startDate: null,
  endDate: null,
  searchQuery: '',
  nextToSelect: 'start',
  isAmountHidden: true,
  sidebarOpen: false,
  isManageCategoriesModalOpen: false,

  setSelectedType: t => set({ selectedType: t }),
  setSelectedCategory: c => set({ selectedCategory: c }),
  setSelectedAsset: a => set({ selectedAsset: a }),
  setSelectedLedger: l => set({ selectedLedger: l }),
  setStartDate: d => set({ startDate: d }),
  setEndDate: d => set({ endDate: d }),
  setSearchQuery: q => set({ searchQuery: q }),
  setNextToSelect: s => set({ nextToSelect: s }),
  toggleAmountVisibility: () =>
    set(state => ({ isAmountHidden: !state.isAmountHidden })),
  setSidebarOpen: s => set({ sidebarOpen: s }),
  setManageCategoriesModalOpen: s => set({ isManageCategoriesModalOpen: s })
}))
