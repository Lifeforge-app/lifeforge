import { useTranslation } from 'react-i18next'

import { APIFallbackComponent, SidebarTitle } from '@lifeforge/ui'

import { useBooksLibraryContext } from '../../../providers/BooksLibraryProvider'
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
  const { t } = useTranslation('apps.booksLibrary')
  const { data, setExistedData, setModifyDataModalOpenType } =
    useBooksLibraryContext()[stuff]

  return (
    <>
      <SidebarTitle
        name={stuff}
        namespace="apps.booksLibrary"
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
      </APIFallbackComponent>
    </>
  )
}

export default SidebarSection
