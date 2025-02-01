import React from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useBooksLibraryContext } from '@providers/BooksLibraryProvider'
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
}): React.ReactElement {
  const { t } = useTranslation('modules.booksLibrary')
  const { data, setExistedData, setModifyDataModalOpenType } =
    useBooksLibraryContext()[stuff]

  return (
    <>
      <SidebarTitle
        namespace="modules.booksLibrary"
        name={stuff}
        {...(hasActionButton
          ? {
              actionButtonIcon: 'tabler:plus',
              actionButtonOnClick: () => {
                setExistedData(null)
                setModifyDataModalOpenType('create')
              }
            }
          : {})}
      />
      <APIFallbackComponent data={data}>
        {data =>
          data.length > 0 ? (
            <>
              {data.map(item => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  stuff={stuff}
                  fallbackIcon={fallbackIcon}
                  hasHamburgerMenu={hasHamburgerMenu}
                />
              ))}
            </>
          ) : (
            <p className="text-center text-bg-500">
              {t(`emptyState.${stuff}`)}
            </p>
          )
        }
      </APIFallbackComponent>
    </>
  )
}

export default SidebarSection
