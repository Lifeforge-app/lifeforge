/* eslint-disable @typescript-eslint/no-explicit-any */
import { usePersonalization } from 'shared'

import TagChip from './TagChip'

interface HeaderFilterProps<
  T extends Record<string, string | string[] | null>
> {
  /** The filterable items available for selection. */
  availableFilters: Record<
    keyof T,
    {
      data: Array<{
        id: string
        icon?: string
        label: string | React.ReactNode
        color?: string
      }>
      isColored?: boolean
    }
  >
  /** The current selected filter values. */
  values: T
  /** Callback functions to handle changes to filter values.
   * The type of value passed to each function is inferred from the corresponding key in `values`.
   *
   * @example If `T` is:
   * ```ts
   * {
   *   category: string | null
   *   tags: string[] | null
   * }
   * ```
   * then `onChange` should be:
   * ```ts
   * onChange: {
   *   category: (value: string | null) => void
   *   tags: (value: string[] | null) => void
   * }
   * ```
   */
  onChange: {
    [K in keyof T]: (value: T[K]) => void
  }
}

/**
 * A filter component that displays selected filter tags based on provided items and values.
 */
function TagsFilter<T extends Record<string, string | string[] | null>>({
  availableFilters: items,
  values,
  onChange
}: HeaderFilterProps<T>) {
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
                  <TagChip
                    key={t.id}
                    actionButtonProps={{
                      icon: 'tabler:x',
                      onClick: () => {
                        const newValues = (values[query] as string[]).filter(
                          v => v !== t.id
                        )

                        onChange[query](
                          (newValues.length > 0 ? newValues : null) as any
                        )
                      }
                    }}
                    color={
                      isColored === true
                        ? (t.color ?? derivedThemeColor)
                        : undefined
                    }
                    icon={t.icon ?? ''}
                    label={t.label ?? ''}
                  />
                ))
              }

              return (
                <TagChip
                  key={query}
                  actionButtonProps={{
                    icon: 'tabler:x',
                    onClick: () => {
                      onChange[query](null as any)
                    }
                  }}
                  color={
                    isColored === true
                      ? (target.color ?? derivedThemeColor)
                      : undefined
                  }
                  icon={target.icon ?? ''}
                  label={target.label ?? ''}
                />
              )
            })()
          : null
      })}
    </div>
  )
}

export default TagsFilter
