import { usePersonalization } from 'shared'

import FilterChip from './components/HeaderFilterChip'

function HeaderFilter<T extends Record<string, string | string[] | null>>({
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
  setValues: Record<keyof T, (value: string | string[] | null) => void>
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
              const target = Array.isArray(values[query])
                ? data.filter(d => (values[query] as string[]).includes(d.id))
                : data.find(d => d.id === values[query])

              if (
                target === undefined ||
                (Array.isArray(target) && target.length === 0)
              ) {
                return null
              }

              if (Array.isArray(target)) {
                return target.map(t => (
                  <FilterChip
                    key={t.id}
                    color={
                      isColored === true
                        ? (t.color ?? derivedThemeColor)
                        : undefined
                    }
                    icon={t.icon ?? ''}
                    label={t.name ?? ''}
                    onRemove={() => {
                      const newValues = (values[query] as string[]).filter(
                        v => v !== t.id
                      )

                      setValues[query](newValues.length > 0 ? newValues : null)
                    }}
                  />
                ))
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
                  label={target.name ?? ''}
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
