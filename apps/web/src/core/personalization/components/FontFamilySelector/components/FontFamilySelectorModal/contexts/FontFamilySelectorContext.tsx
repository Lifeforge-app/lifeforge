import { createContext, useContext } from 'react'

interface FontFamilySelectorContextValue {
  selectedFont: string | null
  setSelectedFont: (font: string | null) => void
}

const FontFamilySelectorContext =
  createContext<FontFamilySelectorContextValue | null>(null)

export function useFontFamilySelector(): FontFamilySelectorContextValue {
  const context = useContext(FontFamilySelectorContext)

  if (!context) {
    throw new Error(
      'useFontFamilySelector must be used within a FontFamilySelectorContext.Provider'
    )
  }

  return context
}

export { FontFamilySelectorContext }
