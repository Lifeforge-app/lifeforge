export function autoFocusableRef<T>(
  autoFocus: boolean,
  ref?: React.RefObject<T>,
  onFocus?: (e: NonNullable<T>) => void
): any {
  return (e: T) => {
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
