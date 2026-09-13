import { useQuery } from '@tanstack/react-query'

import type { InferOutput } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Box,
  Button,
  ContentWrapperWithSidebar,
  ContextMenu,
  ContextMenuItem,
  FAB,
  Flex,
  LayoutWithSidebar,
  ModuleHeader,
  SearchInput,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import AnnasModal from './components/modals/AnnasModal'
import UploadFromDeviceModal from './components/modals/UploadFromDeviceModal'
import useFilter from './hooks/useFilter'
import BookListing, { ViewMode } from './views'

export type BooksLibraryEntry = InferOutput<
  typeof forgeAPI.entries.list
>['items'][number]

export type BooksLibraryCollection = InferOutput<
  typeof forgeAPI.collections.list
>[number]

export type BooksLibraryLanguage = InferOutput<
  typeof forgeAPI.languages.list
>[number]

export type BooksLibraryFileType = InferOutput<
  typeof forgeAPI.fileTypes.list
>[number]

function BooksLibrary() {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  const {
    page,
    collection,
    language,
    favourite,
    fileType,
    readStatus,
    searchQuery,
    setSearchQuery
  } = useFilter()

  const dataQuery = useQuery(
    forgeAPI.entries.list
      .input({
        page: page.toString(),
        collection: collection || undefined,
        language: language || undefined,
        favourite: (favourite.toString() as 'true' | 'false') || undefined,
        fileType: fileType || undefined,
        readStatus: readStatus || undefined,
        query: searchQuery.trim() || undefined
      })
      .queryOptions()
  )

  return (
    <ViewMode.Root>
      <ModuleHeader
        trailing={
          <>
            <ContextMenu
              buttonComponent={
                <Button
                  icon="tabler:plus"
                  tProps={{
                    item: t('items.book')
                  }}
                  onClick={() => {}}
                >
                  new
                </Button>
              }

              componentProps={{
                menu: {
                  width: '16em'
                }
              }}
              display={{ base: 'none', md: 'block' }}
            >
              <ContextMenuItem
                icon="tabler:upload"
                label="Upload from device"
                onClick={() => open(UploadFromDeviceModal, {})}
              />
              <ContextMenuItem
                icon="tabler:archive"
                label="Search Annas"
                onClick={() => open(AnnasModal, {})}
              />
            </ContextMenu>
            <ContextMenu display={{ base: 'block', md: 'none' }}>
              <ViewMode.ContextMenuSelector />
            </ContextMenu>
          </>
        }
      />
      <LayoutWithSidebar>
        <Sidebar />
        <ContentWrapperWithSidebar>
          <Header itemCount={dataQuery.data?.totalItems || 0} />
          <Flex align="center" gap="xs" mb="lg" mt="md">
            <SearchInput
              debounceMs={300}
              searchTarget="book"
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <ViewMode.Selector />
          </Flex>
          <BookListing />
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
      <Box bottom="1.5rem" position="fixed" right="1.5rem" zIndex="50">
        <ContextMenu
          buttonComponent={<FAB position="static" visibilityBreakpoint="md" />}
        >
          <ContextMenuItem
            icon="tabler:upload"
            label="Upload from device"
            onClick={() => open(UploadFromDeviceModal, {})}
          />
          <ContextMenuItem
            icon="tabler:archive"
            label="Search Annas"
            onClick={() => open(AnnasModal, {})}
          />
        </ContextMenu>
      </Box>
    </ViewMode.Root>
  )
}

export default BooksLibrary
