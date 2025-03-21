import { useSearchParams } from 'react-router'

import { SidebarItem, SidebarTitle } from '@lifeforge/ui'

import { IVirtualWardrobeSidebarData } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

function BrandsSection({
  sidebarData,
  setOpen
}: {
  sidebarData: IVirtualWardrobeSidebarData
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle name="Brands" namespace="apps.virtualWardrobe" />
      {Object.entries(sidebarData.brands)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([brand, number]) => (
          <SidebarItem
            key={brand}
            active={searchParams.get('brand') === brand}
            name={brand === '' ? 'Unknown' : brand}
            number={number}
            onCancelButtonClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                brand: ''
              })
              setOpen(false)
            }}
            onClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                brand: brand === '' ? 'unknown' : brand
              })
              setOpen(false)
            }}
          />
        ))}
    </>
  )
}

export default BrandsSection
