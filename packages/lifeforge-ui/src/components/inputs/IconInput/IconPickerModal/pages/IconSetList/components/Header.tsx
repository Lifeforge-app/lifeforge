import { Button } from '@components/buttons'
import { SearchInput } from '@components/inputs'
// @ts-expect-error: Iconify types are not fully compatible with the current setup
import { collections as importedCollections } from '@iconify/collections'
import { type IconifyInfo } from '@iconify/types'
import { useMemo } from 'react'

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
}) {
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
          namespace="common.modals"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stuffToSearch="icon"
          tKey="iconPicker"
          onKeyUp={e => {
            if (e.key === 'Enter' && searchQuery !== '') {
              setCurrentIconSet({ search: searchQuery })
            }
          }}
        />
        <Button
          iconPosition="end"
          icon="tabler:arrow-right"
          onClick={() => {
            if (searchQuery !== '') setCurrentIconSet({ search: searchQuery })
          }}
        >
          Search
        </Button>
      </div>
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row">
        <div className="mt-4 flex w-full flex-wrap gap-2">
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              text={category}
              onClick={() => {
                setSelectedCategory(
                  selectedCategory === category ? null : category
                )
              }}
            />
          ))}
        </div>
        <div className="w-full lg:w-3/5 xl:w-1/3">
          <SearchInput
            customIcon="tabler:filter"
            namespace="common.modals"
            searchQuery={iconFilterTerm}
            setSearchQuery={setIconFilterTerm}
            stuffToSearch="Icon Set"
            tKey="iconPicker"
          />
        </div>
      </div>
    </>
  )
}

export default Header
