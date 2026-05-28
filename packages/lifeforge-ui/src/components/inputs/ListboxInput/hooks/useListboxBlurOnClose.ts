import { useEffect, useRef } from 'react'

/**
 * Blurs the active element inside the listbox when the dropdown closes.
 *
 * Headless UI's `Listbox` does not expose an `onClose` callback, so this hook
 * uses a `MutationObserver` on the listbox root element to detect when the
 * `data-open` attribute is removed (indicating the dropdown closed) and blurs
 * the focused element within it.
 *
 * The blur is deferred to a `requestAnimationFrame` callback to ensure React
 * has committed any state changes before checking focus.
 */
export function useListboxBlurOnClose() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current

    if (!el) return

    const observer = new MutationObserver(() => {
      if (el.hasAttribute('data-open')) return

      requestAnimationFrame(() => {
        if (el.contains(document.activeElement)) {
          ;(document.activeElement as HTMLElement)?.blur()
        }
      })
    })

    observer.observe(el, { attributes: true, attributeFilter: ['data-open'] })

    return () => observer.disconnect()
  }, [])

  return containerRef
}

