import { SidebarItem, SidebarTitle } from 'lifeforge-ui'
import { useSearchParams } from 'react-router'

import VW_CATEGORIES from '@apps/VirtualWardrobe/constants/virtual_wardrobe_categories'
import { IVirtualWardrobeSidebarData } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

function CategoriesSection({
  sidebarData,
  setOpen
}: {
  sidebarData: IVirtualWardrobeSidebarData
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle name="Categories" namespace="apps.virtualWardrobe" />
      {Object.entries(sidebarData.categories)
        .sort((a, b) => b[1] - a[1])
        .map(([category, number]) => (
          <SidebarItem
            key={category}
            active={searchParams.get('category') === category}
            icon={VW_CATEGORIES.find(cat => cat.name === category)?.icon ?? ''}
            name={category}
            number={number}
            onCancelButtonClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                category: '',
                subcategory: ''
              })
              setOpen(false)
            }}
            onClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                category,
                subcategory: ''
              })
              setOpen(false)
            }}
          />
        ))}
    </>
  )
}

export default CategoriesSection
