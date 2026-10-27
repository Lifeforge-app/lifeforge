import { createContext, useContext } from 'react'

/**
 * True when a component is rendered inside the modal's dialog tree. Used by
 * `ModalHeader` to register its title with Headless UI's Dialog so the dialog
 * gets an accessible name without duplicating the title.
 */
export const ModalA11yContext = createContext(false)

export function useInsideModal(): boolean {
  return useContext(ModalA11yContext)
}
