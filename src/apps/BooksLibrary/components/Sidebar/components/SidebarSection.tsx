import { useTranslation } from 'react-i18next'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'

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
  const { dataQuery, setExistedData, setModifyDataModalOpenType } =
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
