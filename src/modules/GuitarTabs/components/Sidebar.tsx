import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { type Loadable } from '@interfaces/common'
import { type IGuitarTabsSidebarData } from '@interfaces/guitar_tabs_interfaces'

function Sidebar({
  sidebarData,
  isOpen,
  setOpen
}: {
  sidebarData: Loadable<IGuitarTabsSidebarData>
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <APIFallbackComponent data={sidebarData}>
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
            {[
              ['singalong', 'mdi:guitar-pick-outline', 'Sing Along'],
              ['fingerstyle', 'mingcute:guitar-line', 'Finger Style'],
              ['uncategorized', 'tabler:music-off', 'Uncategorized']
            ].map(([category, icon, name]) => (
              <SidebarItem
                key={category}
                icon={icon}
                name={name}
                number={
                  sidebarData.categories[
                    category as keyof typeof sidebarData.categories
                  ]
                }
                active={searchParams.get('category') === category}
                onClick={() => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    category
                  })
                  setOpen(false)
                }}
                onCancelButtonClick={() => {
                  setSearchParams({
                    ...Object.fromEntries(searchParams.entries()),
                    category: ''
                  })
                  setOpen(false)
                }}
              />
            ))}
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
                  active={searchParams.get('author') === author}
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      author
                    })
                    setOpen(false)
                  }}
                  onCancelButtonClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      author: ''
                    })
                    setOpen(false)
                  }}
                />
              ))}
          </>
        )}
      </APIFallbackComponent>
    </SidebarWrapper>
  )
}

export default Sidebar
