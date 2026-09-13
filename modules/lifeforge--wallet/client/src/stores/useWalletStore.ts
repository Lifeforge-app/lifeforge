import { create } from 'zustand'

interface WalletState {
  nextToSelect: 'start' | 'end'
  isAmountHidden: boolean

  setNextToSelect: (s: WalletState['nextToSelect']) => void
  toggleAmountVisibility: () => void
}

export const useWalletStore = create<WalletState>()(set => ({
  nextToSelect: 'start',
  isAmountHidden: true,

  setNextToSelect: s => set({ nextToSelect: s }),
  toggleAmountVisibility: () =>
    set(state => ({ isAmountHidden: !state.isAmountHidden }))
}))
