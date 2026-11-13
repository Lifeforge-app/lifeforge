import { createContext, useContext } from 'react'

export const ListboxMultipleContext = createContext(false)

export function useListboxMultiple() {
  return useContext(ListboxMultipleContext)
}
