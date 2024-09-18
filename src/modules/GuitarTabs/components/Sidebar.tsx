import { t } from 'i18next'
import React from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import { type IGuitarTabsSidebarData } from '@interfaces/guitar_tabs_interfaces'

function Sidebar({
  sidebarData,
  isOpen,
  setOpen
}: {
  sidebarData: IGuitarTabsSidebarData | 'loading' | 'error'
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <APIComponentWithFallback data={sidebarData}>
        {sidebarData => (
          <>
            <SidebarItem
              icon="tabler:list"
              name="All scores"
              number={sidebarData.total}
              active={location.search === ''}
              onClick={() => {
                navigate('/guitar-tabs')
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
              number={sidebarData.singalong}
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
              number={sidebarData.fingerstyle}
              active={searchParams.get('category') === 'fingerstyle'}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  category: 'fingerstyle'
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
