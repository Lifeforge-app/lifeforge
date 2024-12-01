// @ts-expect-error - no types for this package
import { collections as importedCollections } from '@iconify/collections'
import { type IconifyInfo } from '@iconify/types'
import React, { useMemo } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import Chip from '../../../components/Chip'

const collections: Record<string, IconifyInfo> = importedCollections

function Header({
  searchQuery,
  setSearchQuery,
  setCurrentIconSet,
  selectedCategory,
  setSelectedCategory,
  iconFilterTerm,
  setIconFilterTerm
}: {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setCurrentIconSet: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    } | null>
  >
  selectedCategory: string | null
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>
  iconFilterTerm: string
  setIconFilterTerm: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const categories = useMemo(
    () => [
      ...new Set(
        Object.values(collections)
          .map(e => e.category)
          .filter(e => e !== undefined)
      )
    ],
    []
  )

  return (
    <>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <SearchInput
          lighter
          hasTopMargin={false}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="icon sets"
          onKeyUp={e => {
            if (e.key === 'Enter' && searchQuery !== '') {
              setCurrentIconSet({ search: searchQuery })
            }
          }}
        />
        <Button
          onClick={() => {
            if (searchQuery !== '') setCurrentIconSet({ search: searchQuery })
          }}
          icon="tabler:arrow-right"
          iconAtEnd
        >
          Search
        </Button>
      </div>
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row">
        <div className="mt-4 flex w-full flex-wrap gap-2">
          {categories.map(category => (
            <Chip
              key={category}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }}
              selected={selectedCategory === category}
              text={category}
            />
          ))}
        </div>
        <div className="w-full lg:w-3/5 xl:w-1/3">
          <SearchInput
            lighter
            hasTopMargin={false}
            searchQuery={iconFilterTerm}
            setSearchQuery={setIconFilterTerm}
            stuffToSearch="filter icon sets"
            customIcon="tabler:filter"
          />
        </div>
      </div>
    </>
  )
}

export default Header
