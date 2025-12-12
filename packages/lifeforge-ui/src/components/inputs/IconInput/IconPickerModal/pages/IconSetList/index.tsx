// @ts-expect-error: Iconify types are not fully compatible with the current setup
import { collections as importedCollections } from '@iconify/collections'
import { type IconifyInfo } from '@iconify/types'
import { useMemo, useState } from 'react'

import { Scrollbar } from '@components/utilities'

import type { IIconSet } from '../../typescript/icon_selector_interfaces'
import CategoryEntry from './components/CategoryEntry'
import Header from './components/Header'

const collections: Record<string, IconifyInfo> = importedCollections

const COLLECTIONS = Object.entries(collections).reduce<
  Record<string, IIconSet[]>
>((acc, [key, value]) => {
  const cat = value.category ?? 'Uncategorized'

  if (acc[cat] === undefined) {
    acc[cat] = []
  }
  acc[cat].push({ ...value, prefix: key })

  return acc
}, {})

export default function IconSetList({
  setCurrentIconSet
}: {
  setCurrentIconSet: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    } | null>
  >
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const [iconFilterTerm, setIconFilterTerm] = useState('')

  const filteredCollections = useMemo(() => {
    const normalizedFilter = iconFilterTerm.trim().toLowerCase()

    return Object.entries(COLLECTIONS)
      .filter(
        ([category]) =>
          selectedCategory === null || selectedCategory === category
      )
      .map(([category, iconSets]) => {
        const filtered =
          normalizedFilter === ''
            ? iconSets
            : iconSets.filter(iconSet =>
                iconSet.name.toLowerCase().includes(normalizedFilter)
              )

        return { category, iconSets: filtered }
      })
      .filter(({ iconSets }) => iconSets.length > 0)
  }, [iconFilterTerm, selectedCategory])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <Header
        iconFilterTerm={iconFilterTerm}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        setCurrentIconSet={setCurrentIconSet}
        setIconFilterTerm={setIconFilterTerm}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
      />
      <Scrollbar autoHeight autoHeightMax="60vh">
        <div className="mt-4 flex min-h-0 w-full flex-col items-center overflow-scroll">
          <div className="flex w-full flex-col">
            {filteredCollections.map(({ category, iconSets }) => (
              <CategoryEntry
                key={category}
                category={category}
                iconSets={iconSets}
                setCurrentIconSet={setCurrentIconSet}
              />
            ))}
          </div>
        </div>
      </Scrollbar>
    </div>
  )
}
