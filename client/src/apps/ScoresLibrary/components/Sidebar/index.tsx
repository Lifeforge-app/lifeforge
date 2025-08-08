import type { UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  QueryWrapper,
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper,
  useModalStore
} from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import type { ScoreLibrarySidebarData } from '@apps/ScoresLibrary'

import ModifyTypeModal from '../modals/ModifyTypeModal'
import SidebarAuthorItem from './components/SidebarAuthorItem'
import SidebarTypeItem from './components/SidebarCategoryItem'
import SidebarCollectionItem from './components/SidebarCollectionItem'
import SidebarStarredItem from './components/SidebarStarredItem'

function Sidebar({
  sidebarDataQuery,
  isOpen,
  setOpen,
  author,
  setAuthor,
  starred,
  setStarred,
  category: type,
  setCategory,
  collection,
  setCollection
}: {
  sidebarDataQuery: UseQueryResult<ScoreLibrarySidebarData>
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  author: string | null
  setAuthor: React.Dispatch<React.SetStateAction<string | null>>
  starred: boolean
  setStarred: React.Dispatch<React.SetStateAction<boolean>>
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
  collection: string | null
  setCollection: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const open = useModalStore(state => state.open)

  const collectionsQuery = useQuery(
    forgeAPI.scoresLibrary.collections.list.queryOptions()
  )

  const sortedAuthors = useMemo(
    () =>
      Object.entries(sidebarDataQuery.data?.authors ?? {}).sort((a, b) => {
        if (a[1] === b[1]) return a[0].localeCompare(b[0])

        return b[1] - a[1]
      }),
    [sidebarDataQuery]
  )

  const handleResetAll = useCallback(() => {
    setCategory(null)
    setCollection(null)
    setAuthor(null)
    setStarred(false)
    setOpen(false)
  }, [])

  const handleResetAuthor = useCallback(() => {
    setAuthor(null)
    setOpen(false)
  }, [])

  const handleOnSelectAuthor = useCallback((author: string | null) => {
    setAuthor(author)
    setOpen(false)
  }, [])

  const handleResetCategory = useCallback(() => {
    setCategory(null)
    setOpen(false)
  }, [])

  const handleSelectCategory = useCallback((category: string | null) => {
    setCategory(category)
    setOpen(false)
  }, [])

  const handleResetCollection = useCallback(() => {
    setCollection(null)
    setOpen(false)
  }, [])

  const handleSelectCollection = useCallback((collection: string | null) => {
    setCollection(collection)
    setOpen(false)
  }, [])

  const handleCreate = useCallback(() => {
    open(ModifyTypeModal, {
      openType: 'create'
    })
  }, [])

  const handleCreateCollection = useCallback(async () => {
    // Use a simple prompt for now; can be replaced with a modal later
    const name = prompt('New collection name')?.trim()

    if (!name) return
    await forgeAPI.scoresLibrary.collections.create.mutate({ name })
    await collectionsQuery.refetch()
  }, [collectionsQuery])

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <QueryWrapper query={sidebarDataQuery}>
        {sidebarData => (
          <>
            <SidebarItem
              active={
                type === null &&
                author === null &&
                !starred &&
                collection === null
              }
              icon="tabler:list"
              label="All scores"
              namespace="apps.scoresLibrary"
              number={sidebarData.total}
              onClick={handleResetAll}
            />
            <SidebarStarredItem
              count={sidebarData.favourites}
              isActive={starred}
              setActive={setStarred}
              setOpen={setOpen}
            />
            <SidebarDivider />
            <SidebarTitle
              actionButtonIcon="tabler:plus"
              actionButtonOnClick={handleCreateCollection}
              label="collections"
              namespace="apps.scoresLibrary"
            />
            <QueryWrapper query={collectionsQuery}>
              {collections => (
                <>
                  {collections.map(c => (
                    <SidebarCollectionItem
                      key={c.id}
                      data={c}
                      isActive={collection === c.id}
                      onCancel={handleResetCollection}
                      onSelect={handleSelectCollection}
                    />
                  ))}
                </>
              )}
            </QueryWrapper>
            <SidebarTitle
              actionButtonIcon="tabler:plus"
              actionButtonOnClick={handleCreate}
              label="categories"
              namespace="apps.scoresLibrary"
            />
            {sidebarData.types.map(t => (
              <SidebarTypeItem
                key={t.id}
                data={t}
                isActive={type === t.id}
                onCancel={handleResetCategory}
                onSelect={handleSelectCategory}
              />
            ))}
            <SidebarDivider />
            <SidebarTitle label="authors" namespace="apps.scoresLibrary" />
            {sortedAuthors.map(([auth, count]) => (
              <SidebarAuthorItem
                key={auth}
                author={auth === 'na' ? null : auth}
                count={count}
                isActive={auth === author}
                onCancel={handleResetAuthor}
                onSelect={handleOnSelectAuthor}
              />
            ))}
          </>
        )}
      </QueryWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
