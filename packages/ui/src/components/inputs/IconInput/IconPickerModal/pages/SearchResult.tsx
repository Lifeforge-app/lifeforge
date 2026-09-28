import { useEffect, useMemo, useState } from 'react'

import { LoadingScreen } from '@/components/feedback'
import { Button, SearchInput } from '@/components/inputs'
import { Flex } from '@/components/primitives'

import { ChipSelector } from '../components/ChipSelector'
import { IconList } from '../components/IconList'

interface IIconSearchResult {
  iconList: string[]
  iconSets: Record<string, IIconSetEntry>
}

interface IIconSetEntry {
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

export function SearchResult({
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
  const [searchQuery, setSearchQuery] = useState(searchTerm ?? '')

  const filteredIconList = useMemo(() => {
    if (iconData === null) return []

    if (currentIconSet !== null) {
      return iconData.iconList.filter(
        e => e.split(':').shift() === currentIconSet
      )
    }

    return iconData.iconList
  }, [currentIconSet, iconData])
  useEffect(() => {
    setIconData(null)
    getIconSet(searchTerm)
      .then(data => {
        if (!data) return
        setIconData(data)
        setCurrentIconSet(null)
      })
      .catch(err => {
        console.error(err)
      })
  }, [searchTerm])

  if (!iconData) {
    return <LoadingScreen />
  }

  return (
    <>
      <Flex gap="sm" width="100%">
        <SearchInput
          bg={{
            base: 'bg-100',
            hover: 'bg-200',
            dark: 'bg-800',
            darkHover: 'bg-700'
          }}
          namespace="common.modals"
          searchTarget="iconPicker.items.icon"
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyUp={e => {
            if (e.key === 'Enter' && searchQuery !== '') {
              setCurrentIconSetProp({ search: searchQuery })
            }
          }}
        />
        <Button
          icon="tabler:arrow-right"
          iconPosition="end"
          onClick={() => {
            if (searchQuery !== '') {
              setCurrentIconSetProp({ search: searchQuery })
            }
          }}
        >
          Search
        </Button>
      </Flex>
      <ChipSelector
        options={Object.keys(iconData.iconSets)}
        value={currentIconSet}
        onChange={setCurrentIconSet}
      />
      <IconList iconList={filteredIconList} onIconSelected={onIconSelected} />
    </>
  )
}
