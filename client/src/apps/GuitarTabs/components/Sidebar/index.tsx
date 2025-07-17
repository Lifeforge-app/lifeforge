import { UseQueryResult } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import {
  QueryWrapper,
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@lifeforge/ui'

import { type IGuitarTabsSidebarData } from '../../interfaces/guitar_tabs_interfaces'
import SidebarAuthorItem from './components/SidebarAuthorItem'
import SidebarCategoryItem from './components/SidebarCategoryItem'
import SidebarStarredItem from './components/SidebarStarredItem'

function Sidebar({
  sidebarDataQuery,
  isOpen,
  setOpen,
  author,
  setAuthor,
  starred,
  setStarred,
  category,
  setCategory
}: {
  sidebarDataQuery: UseQueryResult<IGuitarTabsSidebarData>
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  author: string | null
  setAuthor: React.Dispatch<React.SetStateAction<string | null>>
  starred: boolean
  setStarred: React.Dispatch<React.SetStateAction<boolean>>
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
}) {
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

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <QueryWrapper query={sidebarDataQuery}>
        {sidebarData => (
          <>
            <SidebarItem
              active={category === null && author === null && !starred}
              icon="tabler:list"
              name="All scores"
              namespace="apps.guitarTabs"
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
            <SidebarTitle name="categories" namespace="apps.guitarTabs" />
            {[
              ['singalong', 'mdi:guitar-pick-outline', 'Sing Along'],
              ['fingerstyle', 'mingcute:guitar-line', 'Finger Style'],
              ['uncategorized', 'tabler:music-off', 'Uncategorized']
            ].map(([cat, icon, name]) => (
              <SidebarCategoryItem
                key={cat}
                category={cat}
                count={
                  sidebarData.categories[
                    cat as keyof IGuitarTabsSidebarData['categories']
                  ]
                }
                icon={icon}
                isActive={category === cat}
                name={name}
                onCancel={handleResetCategory}
                onSelect={handleSelectCategory}
              />
            ))}
            <SidebarDivider />
            <SidebarTitle name="authors" namespace="apps.guitarTabs" />
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
