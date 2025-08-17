import { createContext, useContext } from 'react'

interface ListboxContextType {
  currentValue: unknown
  multiple: boolean
}

const ListboxContext = createContext<ListboxContextType | null>(null)

export const ListboxProvider = ListboxContext.Provider

export const useListboxContext = () => {
  const context = useContext(ListboxContext)

  if (!context) {
    throw new Error('useListboxContext must be used within a ListboxProvider')
  }

  return context
}

export default ListboxContext
