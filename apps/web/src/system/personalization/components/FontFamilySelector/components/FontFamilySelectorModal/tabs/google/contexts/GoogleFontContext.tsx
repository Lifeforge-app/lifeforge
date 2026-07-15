import { useQuery } from '@tanstack/react-query'
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

import { usePersonalization } from '@lifeforge/ui'

import forgeAPI from '@/core/utils/forgeAPI'

import { useFontFamilySelector } from '../../../contexts/FontFamilySelectorContext'

import type { FontFamily } from '../index'

interface GoogleFontContextValue {
  categories: string[]
  filteredFonts: FontFamily[]
  fontsQuery: ReturnType<
    typeof useQuery<{
      enabled: boolean
      items: FontFamily[]
    }>
  >
  page: number
  pinnedFontsQuery: ReturnType<typeof useQuery<string[]>>
  scrollableRef: React.MutableRefObject<any>
  searchQuery: string
  selectedCategory: string | null
  selectedFont: string | null
  setSelectedFont: (font: string | null) => void
  setPage: React.Dispatch<React.SetStateAction<number>>
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>
}

const GoogleFontContext = createContext<GoogleFontContextValue | null>(null)

function GoogleFontProvider({ children }: { children: ReactNode }) {
  const { fontFamily } = usePersonalization()
  const { selectedFont, setSelectedFont } = useFontFamilySelector()

  const fontsQuery = useQuery<{
    enabled: boolean
    items: FontFamily[]
  }>(forgeAPI.user.personalization.listGoogleFonts.queryOptions())
  const pinnedFontsQuery = useQuery<string[]>(
    forgeAPI.user.personalization.listGoogleFontsPin.queryOptions()
  )

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [page, setPage] = useState(1)
  const scrollableRef = useRef<any>(null)

  const categories = useMemo(
    () => [...new Set(fontsQuery.data?.items.map(font => font.category))],
    [fontsQuery.data?.items]
  )
  const filteredFonts = useMemo(
    () =>
      fontsQuery.data?.items
        .filter(font => {
          return (
            (font.category === selectedCategory || !selectedCategory) &&
            font.family.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })
        .sort((a, b) => {
          const aPinned = pinnedFontsQuery.data?.includes(a.family) ? 1 : 0

          const bPinned = pinnedFontsQuery.data?.includes(b.family) ? 1 : 0

          if (aPinned !== bPinned) {
            return bPinned - aPinned
          }

          return a.family.localeCompare(b.family)
        }),
    [fontsQuery.data, selectedCategory, searchQuery, pinnedFontsQuery.data]
  )
  useEffect(() => {
    setPage(1)
    scrollableRef.current?.scrollToTop()
  }, [selectedCategory, searchQuery])
  useEffect(() => {
    if (!fontsQuery.data) return

    const idx = filteredFonts?.findIndex(font => font.family === fontFamily)

    setPage(idx && idx !== -1 ? Math.ceil((idx + 1) / 10) : 1)
  }, [fontsQuery.data])

  return (
    <GoogleFontContext
      value={{
        categories,
        filteredFonts: filteredFonts ?? [],
        fontsQuery,
        page,
        pinnedFontsQuery,
        scrollableRef,
        searchQuery,
        selectedCategory,
        selectedFont,
        setPage,
        setSearchQuery,
        setSelectedCategory,
        setSelectedFont
      }}
    >
      {children}
    </GoogleFontContext>
  )
}

function useGoogleFont(): GoogleFontContextValue {
  const context = useContext(GoogleFontContext)

  if (!context) {
    throw new Error('useGoogleFont must be used within a GoogleFontProvider')
  }

  return context
}

export { GoogleFontProvider, useGoogleFont }
