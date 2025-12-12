// @ts-expect-error: Iconify types are not fully compatible with the current setup
import { collections as importedCollections } from '@iconify/collections'
import { type IconifyInfo } from '@iconify/types'
import { memo, useCallback, useMemo } from 'react'
import { usePersonalization } from 'shared'

import { TagChip } from '@components/data-display'
import { Button, SearchInput } from '@components/inputs'

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
  const { derivedThemeColor } = usePersonalization()

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

  const handleSearchKeyUp = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && searchQuery !== '') {
        setCurrentIconSet({ search: searchQuery })
      }
    },
    [searchQuery, setCurrentIconSet]
  )

  const handleSearchButtonClick = useCallback(() => {
    if (searchQuery !== '') setCurrentIconSet({ search: searchQuery })
  }, [searchQuery, setCurrentIconSet])

  const handleCategoryClick = useCallback(
    (category: string) => {
      setSelectedCategory(prev => (prev === category ? null : category))
    },
    [setSelectedCategory]
  )

  return (
    <>
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <SearchInput
          className="component-bg-lighter-with-hover"
          namespace="common.modals"
          searchTarget="iconPicker.items.icon"
          value={searchQuery}
          onChange={setSearchQuery}
          onKeyUp={handleSearchKeyUp}
        />
        <Button
          icon="tabler:arrow-right"
          iconPosition="end"
          onClick={handleSearchButtonClick}
        >
          Search
        </Button>
      </div>
      <div className="flex w-full flex-col items-center gap-8 lg:flex-row">
        <div className="mt-4 flex w-full flex-wrap gap-2">
          {categories.map(category => (
            <TagChip
              key={category}
              color={
                selectedCategory === category ? derivedThemeColor : undefined
              }
              label={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
        <div className="w-full lg:w-3/5 xl:w-1/3">
          <SearchInput
            className="component-bg-lighter-with-hover"
            debounceMs={300}
            icon="tabler:filter"
            namespace="common.modals"
            searchTarget="iconPicker.items.iconSet"
            value={iconFilterTerm}
            onChange={setIconFilterTerm}
          />
        </div>
      </div>
    </>
  )
}

export default memo(Header)
