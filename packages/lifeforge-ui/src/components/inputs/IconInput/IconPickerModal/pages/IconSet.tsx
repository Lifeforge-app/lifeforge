import { SearchInput } from '@components/inputs'
import { EmptyStateScreen } from '@components/screens'
import { useEffect, useMemo, useState } from 'react'
import { AutoSizer, List } from 'react-virtualized'

import ChipSelector from '../components/ChipSelector'
import IconEntry from '../components/IconEntry'

export interface IIconSetData {
  title: string
  total: number
  prefix: string
  uncategorized: string[]
  categories: Record<string, string[]>
}

async function getIconSet(prefix: string): Promise<IIconSetData | null> {
  try {
    const res: IIconSetData = await fetch(
      `https://api.iconify.design/collection?prefix=${prefix}`
    ).then(async res => await res.json())

    return res
  } catch (err) {
    console.error(err)

    return null
  }
}

function IconSet({
  iconSet,
  onIconSelected
}: {
  iconSet: string
  onIconSelected: (icon: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const [currentTag, setCurrentTag] = useState<string | null>(null)

  const [iconData, setIconData] = useState<IIconSetData | null>(null)

  const filteredIconList = useMemo(() => {
    const allIcons = [
      ...(iconData?.uncategorized ?? []),
      ...Object.values(iconData?.categories ?? {}).flat()
    ]

    if (!iconData) return []

    if (!currentTag) {
      return allIcons.filter(icon =>
        icon.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return (iconData.categories[currentTag] || []).filter(icon =>
      icon.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, currentTag, iconData])

  useEffect(() => {
    getIconSet(iconSet)
      .then(data => {
        setIconData(data)
      })
      .catch(console.error)
  }, [])

  return iconData ? (
    <div className="flex size-full min-h-0 flex-1 flex-col">
      <h1 className="mb-6 flex flex-col items-center gap-1 text-center text-3xl font-semibold tracking-wide sm:inline">
        {iconData.title}
      </h1>
      <SearchInput
        lighter
        namespace="common.modals"
        searchQuery={searchTerm}
        setSearchQuery={setSearchTerm}
        stuffToSearch="icon"
        tKey="iconPicker"
      />
      <ChipSelector
        options={Object.keys(iconData.categories ?? {})}
        setValue={setCurrentTag}
        value={currentTag}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        {filteredIconList.length ? (
          <AutoSizer className="mt-6">
            {({ width, height }: { width: number; height: number }) => {
              const itemsPerRow = Math.floor(width / 160) || 1

              return (
                <List
                  height={height - 12}
                  itemsPerRow={Math.floor(width / filteredIconList.length) || 1}
                  rowCount={Math.ceil(filteredIconList.length / itemsPerRow)}
                  rowHeight={120}
                  rowRenderer={({
                    index,
                    key,
                    style
                  }: {
                    index: number
                    key: string
                    style: React.CSSProperties
                  }) => {
                    const fromIndex = index * itemsPerRow

                    const toIndex = fromIndex + itemsPerRow

                    return (
                      <div
                        key={key}
                        className="flex w-full gap-3"
                        style={style}
                      >
                        {filteredIconList
                          .slice(fromIndex, toIndex)
                          .map(icon => (
                            <IconEntry
                              key={icon}
                              icon={icon}
                              iconSet={iconSet}
                              onIconSelected={onIconSelected}
                            />
                          ))}
                      </div>
                    )
                  }}
                  width={width}
                />
              )
            }}
          </AutoSizer>
        ) : (
          <div className="flex-center flex-1">
            <EmptyStateScreen
              icon="tabler:icons-off"
              name="icon"
              namespace="common.modals"
              tKey="iconPicker"
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex w-full justify-center pb-8">
      <span className="loader"></span>
    </div>
  )
}

export default IconSet
