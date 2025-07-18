import { useEffect, useState } from 'react'
import { AutoSizer, List } from 'react-virtualized'

import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
import { EmptyStateScreen } from '@components/screens'

import ChipSelector from '../components/ChipSelector'
import IconEntry from '../components/IconEntry'

export interface IIconSearchResult {
  iconList: string[]
  iconSets: Record<string, IIconSetEntry>
}

export interface IIconSetEntry {
  name: string
  total: number
  author: {
    name: string
    url: string
  }
  license: {
    title: string
    spdx: string
    url: string
  }
  samples: string[]
  height?: number
  displayHeight?: number
  category: string
  palette: boolean
  version?: string
}

export interface Author {
  name: string
  url: string
}

async function getIconSet(
  searchTerm: string
): Promise<IIconSearchResult | null> {
  try {
    const res = await fetch(
      `https://api.iconify.design/search?query=${searchTerm}&limit=9999`
    )

    const data = await res.json()

    let iconList = []

    if (data.icons.length > 0) {
      iconList = data.icons
    } else {
      iconList = []
    }

    const iconSets = data.collections

    return {
      iconList,
      iconSets
    }
  } catch (err) {
    console.error(err)

    return null
  }
}

function Search({
  searchTerm,
  setCurrentIconSetProp,
  onIconSelected
}: {
  searchTerm: string
  setCurrentIconSetProp: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    } | null>
  >
  onIconSelected: (icon: string) => void
}) {
  const [currentIconSet, setCurrentIconSet] = useState<string | null>(null)

  const [iconData, setIconData] = useState<IIconSearchResult | null>(null)

  const [filteredIconList, setFilteredIconList] = useState<string[]>([])

  const [searchQuery, setSearchQuery] = useState(searchTerm ?? '')

  useEffect(() => {
    setIconData(null)
    getIconSet(searchTerm)
      .then(data => {
        if (!data) return
        setIconData(data)
        setFilteredIconList(data.iconList)
        setCurrentIconSet(null)
      })
      .catch(err => {
        console.error(err)
      })
  }, [searchTerm])

  useEffect(() => {
    if (iconData !== null) {
      setFilteredIconList(
        currentIconSet !== null
          ? iconData.iconList.filter(
              e => e.split(':').shift() === currentIconSet
            )
          : iconData.iconList
      )
    }
  }, [currentIconSet, iconData])

  return iconData !== null ? (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="flex w-full gap-2">
        <SearchInput
          lighter
          namespace="common.modals"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="icon"
          tKey="iconPicker"
          onKeyUp={e => {
            if (e.key === 'Enter' && searchQuery !== '') {
              setCurrentIconSetProp({ search: searchQuery })
            }
          }}
        />
        <Button
          iconAtEnd
          icon="tabler:arrow-right"
          onClick={() => {
            if (searchQuery !== '') {
              setCurrentIconSetProp({ search: searchQuery })
            }
          }}
        >
          Search
        </Button>
      </div>
      <ChipSelector
        options={Object.keys(iconData.iconSets)}
        setValue={setCurrentIconSet}
        value={currentIconSet}
      />
      <div className="flex min-h-0 flex-1 flex-col">
        {filteredIconList.length > 0 ? (
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
                              icon={icon.split(':').pop() ?? ''}
                              iconSet={icon.split(':').shift() ?? ''}
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
          <div className="flex-center h-full flex-1">
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

export default Search
