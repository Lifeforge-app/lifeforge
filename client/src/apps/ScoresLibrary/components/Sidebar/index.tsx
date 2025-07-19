import { UseQueryResult } from '@tanstack/react-query'
import {
  QueryWrapper,
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper,
  useModalStore
} from 'lifeforge-ui'
import { useCallback, useMemo } from 'react'

import { ScoresLibraryCollectionsSchemas } from 'shared/types/collections'

import ModifyTypeModal from '../modals/ModifyTypeModal'
import SidebarAuthorItem from './components/SidebarAuthorItem'
import SidebarTypeItem from './components/SidebarCategoryItem'
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
  setCategory
}: {
  sidebarDataQuery: UseQueryResult<ScoresLibraryCollectionsSchemas.ISidebarData>
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  author: string | null
  setAuthor: React.Dispatch<React.SetStateAction<string | null>>
  starred: boolean
  setStarred: React.Dispatch<React.SetStateAction<boolean>>
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const open = useModalStore(state => state.open)

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

  const handleCreate = useCallback(() => {
    open(ModifyTypeModal, {
      openType: 'create',
      existedData: null
    })
  }, [])

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <QueryWrapper query={sidebarDataQuery}>
        {sidebarData => (
          <>
            <SidebarItem
              active={type === null && author === null && !starred}
              icon="tabler:list"
              name="All scores"
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
              actionButtonOnClick={handleCreate}
              name="categories"
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
            <SidebarTitle name="authors" namespace="apps.scoresLibrary" />
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
