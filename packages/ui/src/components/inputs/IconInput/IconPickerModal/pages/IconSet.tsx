import { useEffect, useMemo, useState } from 'react'
import { AutoSizer, List } from 'react-virtualized'

import { EmptyStateScreen, LoadingScreen } from '@/components/feedback'
import { SearchInput } from '@/components/inputs'
import { Flex, Text } from '@/components/primitives'

import { ChipSelector } from '../components/ChipSelector'
import { IconEntry } from '../components/IconEntry'

interface IIconSetData {
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

export function IconSet({
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
    if (!iconData) return []

    const allIcons = [
      ...(iconData.uncategorized ?? []),
      ...Object.values(iconData.categories ?? {}).flat()
    ]

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

  if (!iconData) {
    return <LoadingScreen />
  }

  return (
    <>
      <Text
        align="center"
        as="h1"
        mb="lg"
        size="3xl"
        tracking="wide"
        weight="semibold"
      >
        {iconData.title}
      </Text>
      <SearchInput
        bg={{
          base: 'bg-100',
          hover: 'bg-200',
          dark: 'bg-800',
          darkHover: 'bg-700'
        }}
        namespace="common.modals"
        searchTarget="iconPicker.icon"
        value={searchTerm}
        onChange={setSearchTerm}
      />
      <ChipSelector
        options={Object.keys(iconData.categories ?? {})}
        value={currentTag}
        onChange={setCurrentTag}
      />
      {filteredIconList.length ? (
        <Flex direction="column" flex="1" minHeight="0" mt="md">
          <AutoSizer>
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
                      <Flex key={key} gap="sm" style={style} width="100%">
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
                      </Flex>
                    )
                  }}
                  width={width}
                />
              )
            }}
          </AutoSizer>
        </Flex>
      ) : (
        <Flex align="center" flex="1" height="100%" justify="center">
          <EmptyStateScreen
            icon="tabler:icons-off"
            message={{
              id: 'icon',
              namespace: 'common.modals',
              tKey: 'iconPicker'
            }}
          />
        </Flex>
      )}
    </>
  )
}
