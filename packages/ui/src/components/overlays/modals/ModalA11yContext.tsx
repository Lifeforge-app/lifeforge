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

/**
 * Element that overlays should portal into while a modal is open.
 *
 * Headless UI marks everything outside the dialog as `inert` while it is open,
 * so portalling a menu or tooltip into `#app` leaves it unclickable. This
 * element lives inside the dialog, next to the panel, so portalled content
 * stays interactive and is not treated as a click outside the dialog.
 *
 * `null` outside a modal, where callers should fall back to their own target.
 */
export const ModalPortalContainerContext = createContext<HTMLElement | null>(
  null
)

export function useModalPortalContainer(): HTMLElement | null {
  return useContext(ModalPortalContainerContext)
}
