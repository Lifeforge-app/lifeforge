import { SidebarItem, SidebarTitle } from 'lifeforge-ui'
import { useSearchParams } from 'react-router'

import VW_COLORS from '@apps/VirtualWardrobe/constants/virtual_wardrobe_colors'
import { IVirtualWardrobeSidebarData } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

function ColorsSection({
  sidebarData,
  setOpen
}: {
  sidebarData: IVirtualWardrobeSidebarData
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle name="Colors" namespace="apps.virtualWardrobe" />
      {Object.entries(sidebarData.colors)
        .sort((a, b) => b[1] - a[1])
        .map(([color, number]) => (
          <SidebarItem
            key={color}
            active={searchParams.get('color') === color}
            name={color}
            number={number}
            sideStripColor={VW_COLORS.find(c => c.name === color)?.hex}
            onCancelButtonClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                color: ''
              })
              setOpen(false)
            }}
            onClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                color
              })
              setOpen(false)
            }}
          />
        ))}
    </>
  )
}

export default ColorsSection
