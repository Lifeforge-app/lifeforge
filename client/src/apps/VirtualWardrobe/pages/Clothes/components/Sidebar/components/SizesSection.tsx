import { SidebarItem, SidebarTitle } from 'lifeforge-ui'
import React from 'react'
import { useSearchParams } from 'react-router'

import { IVirtualWardrobeSidebarData } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

function SizesSection({
  sidebarData,
  setOpen
}: {
  sidebarData: IVirtualWardrobeSidebarData
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle name="Sizes" namespace="apps.virtualWardrobe" />
      {Object.entries(sidebarData.sizes)
        .sort((a, b) => b[1] - a[1])
        .map(([size, number]) => (
          <SidebarItem
            key={size}
            active={searchParams.get('size') === size}
            name={size}
            number={number}
            onCancelButtonClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                size: ''
              })
              setOpen(false)
            }}
            onClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                size
              })
              setOpen(false)
            }}
          />
        ))}
    </>
  )
}

export default SizesSection
