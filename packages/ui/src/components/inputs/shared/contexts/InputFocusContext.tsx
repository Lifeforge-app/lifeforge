import { createContext, useCallback, useContext, useRef, useState } from 'react'

type FocusableElement = HTMLElement & {
  contains?(node: Node | null): boolean
}

export const InputFocusContext = createContext(false)

export function useInputFocused() {
  return useContext(InputFocusContext)
}

export function InputFocusProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [isFocused, setIsFocused] = useState(false)

  const containerRef = useRef<FocusableElement>(null)

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (
      containerRef.current?.contains
        ? !containerRef.current.contains(e.relatedTarget as Node | null)
        : true
    ) {
      setIsFocused(false)
    }
  }, [])

  return (
    <span
      ref={containerRef as React.Ref<HTMLSpanElement>}
      onBlur={handleBlur}
      onFocus={handleFocus}
      style={{ display: 'contents' }}
    >
      <InputFocusContext.Provider value={isFocused}>
        {children}
      </InputFocusContext.Provider>
    </span>
  )
}
