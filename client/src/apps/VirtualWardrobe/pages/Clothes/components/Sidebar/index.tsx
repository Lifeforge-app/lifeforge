import { UseQueryResult } from '@tanstack/react-query'
import {
  QueryWrapper,
  SidebarDivider,
  SidebarItem,
  SidebarWrapper
} from 'lifeforge-ui'
import { useSearchParams } from 'react-router'

import { type IVirtualWardrobeSidebarData } from '../../../../interfaces/virtual_wardrobe_interfaces'
import BrandsSection from './components/BrandsSection'
import CategoriesSection from './components/CategoriesSection'
import ColorsSection from './components/ColorsSection'
import SizesSection from './components/SizesSection'
import SubcategoriesSection from './components/SubcategoriesSection'

function Sidebar({
  isOpen,
  setOpen,
  sidebarDataQuery
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  sidebarDataQuery: UseQueryResult<IVirtualWardrobeSidebarData>
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <QueryWrapper query={sidebarDataQuery}>
        {sidebarData => (
          <>
            <SidebarItem
              active={Array.from(searchParams.keys()).every(
                key => !searchParams.get(key)
              )}
              icon="tabler:list"
              name="All Clothes"
              namespace="apps.virtualWardrobe"
              number={sidebarData.total}
              onClick={() => {
                setSearchParams({})
                setOpen(false)
              }}
            />
            <SidebarItem
              active={searchParams.get('favourite') === 'true'}
              icon="tabler:heart"
              name="Favourites"
              namespace="apps.virtualWardrobe"
              number={sidebarData.favourites}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  favourite: 'true'
                })
                setOpen(false)
              }}
            />
            <SidebarDivider />
            <CategoriesSection setOpen={setOpen} sidebarData={sidebarData} />
            <SidebarDivider />
            <SubcategoriesSection setOpen={setOpen} sidebarData={sidebarData} />
            <BrandsSection setOpen={setOpen} sidebarData={sidebarData} />
            <SidebarDivider />
            <SizesSection setOpen={setOpen} sidebarData={sidebarData} />
            <SidebarDivider />
            <ColorsSection setOpen={setOpen} sidebarData={sidebarData} />
          </>
        )}
      </QueryWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
