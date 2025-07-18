import { usePersonalization } from 'shared/lib'

import FilterChip from './components/HeaderFilterChip'

function HeaderFilter({
  items,
  values,
  setValues
}: {
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
  values: Record<string, string | null>
  setValues: Record<string, (value: string | null) => void>
}) {
  const { derivedThemeColor } = usePersonalization()

  if (
    !(
      Object.values(items).every(({ data }) => typeof data !== 'string') &&
      Object.keys(items).some(query => Boolean(values[query]))
    )
  ) {
    return <></>
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {Object.entries(items).map(([query, { data, isColored }]) => {
        return typeof data !== 'string' && Boolean(values[query])
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
