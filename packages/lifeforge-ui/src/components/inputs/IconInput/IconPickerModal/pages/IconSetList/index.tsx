// @ts-ignore
import { type IIconSet } from '@components/inputs/IconInput/IconPickerModal/typescript/icon_selector_interfaces'
import { Scrollbar } from '@components/utilities'
import { collections as importedCollections } from '@iconify/collections'
import { type IconifyInfo } from '@iconify/types'
import { useState } from 'react'

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
            {Object.entries(COLLECTIONS).map(
              ([category, iconSets]) =>
                Boolean(
                  (selectedCategory === null ||
                    selectedCategory === category) &&
                    iconSets.filter(
                      iconSet =>
                        iconFilterTerm.trim() === '' ||
                        iconSet.name
                          .toLowerCase()
                          .includes(iconFilterTerm.trim().toLowerCase())
                    ).length
                ) && (
                  <CategoryEntry
                    key={category}
                    category={category}
                    iconFilterTerm={iconFilterTerm}
                    iconSets={iconSets}
                    setCurrentIconSet={setCurrentIconSet}
                  />
                )
            )}
          </div>
        </div>
      </Scrollbar>
    </div>
  )
}
