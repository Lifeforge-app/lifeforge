import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  HeaderFilter,
  useModuleSidebarState
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import useFilter from '../hooks/useFilter'
import AnnasModal from './modals/AnnasModal'
import LibgenModal from './modals/LibgenModal'
import UploadFromDeviceModal from './modals/UploadFromDeviceModal'

function Header({ itemCount }: { itemCount: number }) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.booksLibrary')

  const { setIsSidebarOpen } = useModuleSidebarState()

  const collectionsQuery = useQuery(
    forgeAPI.booksLibrary.collections.list.queryOptions()
  )

  const languagesQuery = useQuery(
    forgeAPI.booksLibrary.languages.list.queryOptions()
  )

  const fileTypesQuery = useQuery(
    forgeAPI.booksLibrary.fileTypes.list.queryOptions()
  )

  const {
    searchQuery,
    updateFilter,
    collection,
    favourite,
    fileType,
    language,
    readStatus
  } = useFilter()

  const handleOpenLibgenModal = useCallback(() => {
    open(LibgenModal, {})
  }, [])

  const handleOpenAnnasModal = useCallback(() => {
    open(AnnasModal, {})
  }, [])

  return (
    <div>
      <div className="flex-between flex">
        <h1 className="text-3xl font-semibold">
          {Object.values([
            collection,
            favourite,
            fileType,
            language,
            readStatus
          ]).every(value => !value) && !searchQuery.trim()
            ? 'All'
            : 'Filtered'}{' '}
          Books <span className="text-bg-500 text-base">({itemCount})</span>
        </h1>
        <div className="flex items-center gap-6">
          <ContextMenu
            buttonComponent={
              <Button
                className="hidden sm:flex"
                icon="tabler:plus"
                tProps={{
                  item: t('items.book')
                }}
                onClick={() => {}}
              >
                new
              </Button>
            }
            classNames={{ wrapper: 'hidden md:block', menu: 'w-64' }}
          >
            <ContextMenuItem
              icon="tabler:upload"
              label="Upload from device"
              namespace="apps.booksLibrary"
              onClick={() => {
                open(UploadFromDeviceModal, {})
              }}
            />
            <ContextMenuItem
              icon="tabler:books"
              label="Download from Libgen"
              namespace="apps.booksLibrary"
              onClick={handleOpenLibgenModal}
            />
            <ContextMenuItem
              icon="tabler:archive"
              label="Search Annas"
              namespace="apps.booksLibrary"
              onClick={handleOpenAnnasModal}
            />
          </ContextMenu>
          <Button
            className="lg:hidden"
            icon="tabler:menu"
            variant="plain"
            onClick={() => {
              setIsSidebarOpen(true)
            }}
          />
        </div>
      </div>
      <HeaderFilter
        items={{
          collection: {
            data: collectionsQuery.data ?? []
          },
          fileType: {
            data:
              fileTypesQuery.data?.map(e => ({
                id: e.id,
                name: e.name,
                icon: 'tabler:file-text'
              })) ?? []
          },
          language: {
            data: languagesQuery.data ?? []
          }
        }}
        setValues={{
          collection: value => updateFilter('collection', value || null),
          fileType: value => updateFilter('fileType', value || null),
          language: value => updateFilter('language', value || null)
        }}
        values={{
          collection: collection ?? '',
          fileType: fileType ?? '',
          language: language ?? ''
        }}
      />
    </div>
  )
}

export default Header
