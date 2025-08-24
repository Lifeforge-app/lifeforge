import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { SidebarTitle, WithQuery } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import ModifyModal from '@apps/BooksLibrary/modals/ModifyModal'

import SidebarItem from './SidebarItem'

function SidebarSection({
  stuff,
  fallbackIcon,
  hasActionButton = true,
  hasContextMenu = true
}: {
  stuff: 'collections' | 'languages' | 'fileTypes'
  fallbackIcon?: string
  hasActionButton?: boolean
  hasContextMenu?: boolean
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.booksLibrary')

  const collectionsQuery = useQuery(
    forgeAPI.booksLibrary.collections.list.queryOptions()
  )

  const languagesQuery = useQuery(
    forgeAPI.booksLibrary.languages.list.queryOptions()
  )

  const fileTypesQuery = useQuery(
    forgeAPI.booksLibrary.fileTypes.list.queryOptions()
  )

  const handleCreateItem = useCallback(() => {
    open(ModifyModal, {
      type: 'create',
      initialData: null,
      stuff: stuff as 'collections' | 'languages'
    })
  }, [stuff])

  const dataQuery = useMemo(
    () =>
      ({
        collections: collectionsQuery,
        languages: languagesQuery,
        fileTypes: fileTypesQuery
      })[stuff],
    [stuff, collectionsQuery, languagesQuery, fileTypesQuery]
  )

  return (
    <>
      <SidebarTitle
        label={stuff}
        namespace="apps.booksLibrary"
        {...(hasActionButton
          ? {
              actionButtonIcon: 'tabler:plus',
              actionButtonOnClick: handleCreateItem
            }
          : {})}
      />
      <WithQuery query={dataQuery}>
        {data =>
          data.length > 0 ? (
            <>
              {data.map(item => (
                <SidebarItem
                  key={item.id}
                  fallbackIcon={fallbackIcon}
                  hasContextMenu={hasContextMenu}
                  item={item}
                  stuff={stuff}
                />
              ))}
            </>
          ) : (
            <p className="text-bg-500 text-center">{t(`empty.${stuff}`)}</p>
          )
        }
      </WithQuery>
    </>
  )
}

export default SidebarSection
