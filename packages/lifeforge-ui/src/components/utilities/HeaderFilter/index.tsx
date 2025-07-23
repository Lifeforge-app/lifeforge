import { usePersonalization } from 'shared'

import FilterChip from './components/HeaderFilterChip'

function HeaderFilter<T extends Record<string, string | null>>({
  items,
  values,
  setValues
}: {
  items: Record<
    keyof T,
    {
      data: Array<{
        id: string
        icon?: string
        name: string
        color?: string
      }>
      isColored?: boolean
    }
  >
  values: T
  setValues: Record<keyof T, (value: string | null) => void>
}) {
  const { derivedThemeColor } = usePersonalization()

  if (!Object.keys(items).some(query => Boolean(values[query]))) {
    return <></>
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {Object.entries(items).map(([query, { data, isColored }]) => {
        return values[query]
          ? (() => {
              const target = data.find(item => item.id === values[query])

              if (target === undefined) {
                return null
              }

              return (
                <FilterChip
                  key={query}
                  color={
                    isColored === true
                      ? (target.color ?? derivedThemeColor)
                      : undefined
                  }
                  icon={target.icon ?? ''}
                  text={target.name ?? ''}
                  onRemove={() => {
                    setValues[query](null)
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
