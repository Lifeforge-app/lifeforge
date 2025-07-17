import { useSearchParams } from 'react-router'

import { SidebarDivider, SidebarItem, SidebarTitle } from '@lifeforge/ui'

import VW_CATEGORIES from '@apps/VirtualWardrobe/constants/virtual_wardrobe_categories'
import { IVirtualWardrobeSidebarData } from '@apps/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

function SubcategoriesSection({
  sidebarData,
  setOpen
}: {
  sidebarData: IVirtualWardrobeSidebarData
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const allSubcategories = VW_CATEGORIES.find(
    cat => cat.name === searchParams.get('category')
  )?.subcategories

  if (allSubcategories === undefined) {
    return <></>
  }

  return (
    <>
      <SidebarTitle name="Subcategories" namespace="apps.virtualWardrobe" />
      {Object.entries(sidebarData.subcategories)
        .filter(([subcategory]) => allSubcategories.includes(subcategory))
        .sort((a, b) => b[1] - a[1])
        .map(([subcategory, number]) => (
          <SidebarItem
            key={subcategory}
            active={searchParams.get('subcategory') === subcategory}
            name={subcategory}
            number={number}
            onCancelButtonClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                subcategory: ''
              })
              setOpen(false)
            }}
            onClick={() => {
              setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                subcategory
              })
              setOpen(false)
            }}
          />
        ))}
      <SidebarDivider />
    </>
  )
}

export default SubcategoriesSection
