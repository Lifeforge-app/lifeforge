import { UseQueryResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import {
  QueryWrapper,
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@lifeforge/ui'

import { type IGuitarTabsSidebarData } from '../interfaces/guitar_tabs_interfaces'

function Sidebar({
  sidebarDataQuery,
  isOpen,
  setOpen
}: {
  sidebarDataQuery: UseQueryResult<IGuitarTabsSidebarData>
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { t } = useTranslation('apps.guitarTabs')
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <QueryWrapper query={sidebarDataQuery}>
        {sidebarData => (
          <>
            <SidebarItem
              active={Array.from(searchParams.keys()).length === 0}
              icon="tabler:list"
              name="All scores"
              namespace="apps.guitarTabs"
              number={sidebarData.total}
              onClick={() => {
                setSearchParams({})
                setOpen(false)
              }}
            />
            <SidebarItem
              active={searchParams.get('starred') === 'true'}
              icon="tabler:star-filled"
              name="Starred"
              namespace="apps.guitarTabs"
              number={sidebarData.favourites}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  starred: 'true'
                })
                setOpen(false)
              }}
            />
            <SidebarDivider />
            <SidebarTitle name="categories" namespace="apps.guitarTabs" />
            {[
              ['singalong', 'mdi:guitar-pick-outline', 'Sing Along'],
              ['fingerstyle', 'mingcute:guitar-line', 'Finger Style'],
              ['uncategorized', 'tabler:music-off', 'Uncategorized']
            ].map(([category, icon, name]) => (
              <SidebarItem
                key={category}
                active={searchParams.get('category') === category}
                icon={icon}
                name={name}
                namespace="apps.guitarTabs"
                number={
                  sidebarData.categories[
                    category as keyof typeof sidebarData.categories
                  ]
                }
                onCancelButtonClick={() => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    category: ''
                  })
                  setOpen(false)
                }}
                onClick={() => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    category
                  })
                  setOpen(false)
                }}
              />
            ))}
            <SidebarDivider />
            <SidebarTitle name="authors" namespace="apps.guitarTabs" />
            {Object.entries(sidebarData.authors)
              .sort((a, b) => {
                if (a[1] === b[1]) return a[0].localeCompare(b[0])
                return b[1] - a[1]
              })
              .map(([author, count]) => (
                <SidebarItem
                  key={author ?? 'na'}
                  active={searchParams.get('author') === (author || 'na')}
                  autoActive={false}
                  icon="tabler:user"
                  name={author !== '' ? author : t('unknownAuthor')}
                  number={count}
                  onCancelButtonClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      author: ''
                    })
                    setOpen(false)
                  }}
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      author: author || 'na'
                    })
                    setOpen(false)
                  }}
                />
              ))}
          </>
        )}
      </QueryWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
