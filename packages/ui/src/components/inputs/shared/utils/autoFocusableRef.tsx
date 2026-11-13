export function autoFocusableRef<T>(
  autoFocus: boolean,
  ref?: React.RefObject<T | null>,
  onFocus?: (e: T) => void
): React.RefCallback<T> {
  return (e: T | null) => {
    if (ref) {
      ref.current = e
    }

    if (e && autoFocus) {
      if (onFocus) {
        onFocus(e)
      }

      if (
        typeof e !== 'object' ||
        !('focus' in e) ||
        typeof e.focus !== 'function'
      ) {
        return
      }

      e.focus()
    }
  }
}
