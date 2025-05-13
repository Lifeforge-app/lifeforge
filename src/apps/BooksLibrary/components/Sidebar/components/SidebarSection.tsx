import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { useBooksLibraryContext } from '@apps/BooksLibrary/providers/BooksLibraryProvider'

import SidebarItem from './SidebarItem'

function SidebarSection({
  stuff,
  fallbackIcon,
  hasActionButton = true,
  hasHamburgerMenu = true
}: {
  stuff: 'categories' | 'languages' | 'fileTypes'
  fallbackIcon?: string
  hasActionButton?: boolean
  hasHamburgerMenu?: boolean
}) {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.booksLibrary')
  const { categoriesQuery, languagesQuery, fileTypesQuery } =
    useBooksLibraryContext()

  const handleCreateItem = useCallback(() => {
    open(`booksLibrary.modify`, {
      type: 'create',
      existedData: null,
      stuff
    })
  }, [stuff])

  const dataQuery = useMemo(
    () =>
      ({
        categories: categoriesQuery,
        languages: languagesQuery,
        fileTypes: fileTypesQuery
      })[stuff],
    [stuff, categoriesQuery, languagesQuery, fileTypesQuery]
  )

  return (
    <>
      <SidebarTitle
        name={stuff}
        namespace="apps.booksLibrary"
        {...(hasActionButton
          ? {
              actionButtonIcon: 'tabler:plus',
              actionButtonOnClick: handleCreateItem
            }
          : {})}
      />
      <QueryWrapper query={dataQuery}>
        {data =>
          data.length > 0 ? (
            <>
              {data.map(item => (
                <SidebarItem
                  key={item.id}
                  fallbackIcon={fallbackIcon}
                  hasHamburgerMenu={hasHamburgerMenu}
                  item={item}
                  stuff={stuff}
                />
              ))}
            </>
          ) : (
            <p className="text-bg-500 text-center">
              {t(`emptyState.${stuff}`)}
            </p>
          )
        }
      </QueryWrapper>
    </>
  )
}

export default SidebarSection
