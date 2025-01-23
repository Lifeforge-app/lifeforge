import React, { useMemo } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { rgbToHex } from '@utils/colors'
import FilterChip from './components/HeaderFilterChip'

function HeaderFilter({
  searchParams,
  setSearchParams,
  items
}: {
  searchParams: URLSearchParams
  setSearchParams: (
    searchParams: Record<string, string> | URLSearchParams
  ) => void
  items: Record<
    string,
    {
      data:
        | Array<{
            id: string
            icon?: string
            name: string
            color?: string
          }>
        | 'loading'
        | 'error'
      isColored?: boolean
    }
  >
}): React.ReactElement {
  const { theme } = useThemeColors()
  const themeColorHex = useMemo(() => {
    if (theme.startsWith('#')) {
      return theme
    }
    const [r, g, b] = theme.match(/\((\d+), (\d+), (\d+)\)/)?.slice(1) ?? []
    return rgbToHex(Number(r), Number(g), Number(b))
  }, [theme])

  if (
    !(
      Object.values(items).every(({ data }) => typeof data !== 'string') &&
      Object.keys(items).some(query => Boolean(searchParams.get(query)))
    )
  ) {
    return <></>
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {Object.entries(items).map(([query, { data, isColored }]) => {
        return typeof data !== 'string' && Boolean(searchParams.get(query))
          ? (() => {
              const target = data.find(
                item => item.id === searchParams.get(query)
              )
              if (target === undefined) {
                return null
              }

              return (
                <FilterChip
                  key={query}
                  color={
                    isColored === true
                      ? target.color ?? themeColorHex
                      : undefined
                  }
                  icon={target.icon ?? ''}
                  text={target.name ?? ''}
                  onRemove={() => {
                    searchParams.delete(query)
                    setSearchParams(searchParams)
                  }}
                />
              )
            })()
          : null
      })}
    </div>
  )
}

export default HeaderFilter
