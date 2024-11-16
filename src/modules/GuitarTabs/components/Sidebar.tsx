import { t } from 'i18next'
import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import { type IGuitarTabsSidebarData } from '@interfaces/guitar_tabs_interfaces'

function Sidebar({
  sidebarData,
  isOpen,
  setOpen,
  searchParams,
  setSearchParams
}: {
  sidebarData: IGuitarTabsSidebarData | 'loading' | 'error'
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchParams: URLSearchParams
  setSearchParams: (params: Record<string, string> | URLSearchParams) => void
}): React.ReactElement {
  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <APIComponentWithFallback data={sidebarData}>
        {sidebarData => (
          <>
            <SidebarItem
              icon="tabler:list"
              name="All scores"
              number={sidebarData.total}
              active={Array.from(searchParams.keys()).length === 0}
              onClick={() => {
                setSearchParams({})
                setOpen(false)
              }}
            />
            <SidebarItem
              icon="tabler:star-filled"
              name="Starred"
              number={sidebarData.favourites}
              active={searchParams.get('starred') === 'true'}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  starred: 'true'
                })
                setOpen(false)
              }}
            />
            <SidebarDivider />
            <SidebarTitle name="categories" />
            <SidebarItem
              icon="mdi:guitar-pick-outline"
              name="Sing Along"
              number={sidebarData.categories.singalong}
              active={searchParams.get('category') === 'singalong'}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  category: 'singalong'
                })
                setOpen(false)
              }}
            />
            <SidebarItem
              icon="mingcute:guitar-line"
              name="Finger Style"
              number={sidebarData.categories.fingerstyle}
              active={searchParams.get('category') === 'fingerstyle'}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  category: 'fingerstyle'
                })
                setOpen(false)
              }}
            />
            <SidebarItem
              icon="tabler:music-off"
              name="Uncategorized"
              number={sidebarData.categories.uncategorized}
              active={searchParams.get('category') === 'uncategorized'}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  category: 'uncategorized'
                })
                setOpen(false)
              }}
            />
            <SidebarDivider />
            <SidebarTitle name="authors" />
            {Object.entries(sidebarData.authors)
              .sort((a, b) => {
                if (a[1] === b[1]) return a[0].localeCompare(b[0])
                return b[1] - a[1]
              })
              .map(([author, count]) => (
                <SidebarItem
                  key={author}
                  icon="tabler:user"
                  name={author !== '' ? author : t('guitarTabs.unknownAuthor')}
                  number={count}
                  autoActive={false}
                  needTranslate={false}
                  active={searchParams.get('author') === author}
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      author
                    })
                    setOpen(false)
                  }}
                />
              ))}
          </>
        )}
      </APIComponentWithFallback>
    </SidebarWrapper>
  )
}

export default Sidebar
