import React from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import VW_CATEGORIES from '@constants/virtual_wardrobe_categories'
import VW_COLORS from '@constants/virtual_wardrobe_colors'
import { Loadable } from '@interfaces/common'
import { type IVirtualWardrobeSidebarData } from '@interfaces/virtual_wardrobe_interfaces'

function Sidebar({
  isOpen,
  setOpen,
  sidebarData
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  sidebarData: Loadable<IVirtualWardrobeSidebarData>
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <APIFallbackComponent data={sidebarData}>
        {sidebarData => (
          <>
            <SidebarItem
              icon="tabler:list"
              name="All Clothes"
              number={sidebarData.total}
              active={Array.from(searchParams.keys()).length === 0}
              onClick={() => {
                setSearchParams({})
                setOpen(false)
              }}
            />
            <SidebarItem
              icon="tabler:heart"
              name="Favourites"
              number={sidebarData.favourites}
              active={searchParams.get('favourite') === 'true'}
              onClick={() => {
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  favourite: 'true'
                })
                setOpen(false)
              }}
            />
            <SidebarDivider />
            <SidebarTitle name="Categories" />
            {Object.entries(sidebarData.categories)
              .sort((a, b) => b[1] - a[1])
              .map(([category, number]) => (
                <SidebarItem
                  key={category}
                  name={category}
                  number={number}
                  icon={
                    VW_CATEGORIES.find(cat => cat.name === category)?.icon ?? ''
                  }
                  needTranslate={false}
                  active={searchParams.get('category') === category}
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      category,
                      subcategory: ''
                    })
                    setOpen(false)
                  }}
                  onCancelButtonClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      category: '',
                      subcategory: ''
                    })
                    setOpen(false)
                  }}
                />
              ))}
            <SidebarDivider />
            {VW_CATEGORIES.findIndex(
              e => e.name === searchParams.get('category')
            ) !== -1 &&
              (() => {
                const allSubcategories = VW_CATEGORIES.find(
                  cat => cat.name === searchParams.get('category')
                )?.subcategories

                if (allSubcategories === undefined) {
                  return null
                }
                return (
                  <>
                    <SidebarTitle name="Subcategories" />
                    {Object.entries(sidebarData.subcategories)
                      .filter(([subcategory]) =>
                        allSubcategories.includes(subcategory)
                      )
                      .sort((a, b) => b[1] - a[1])
                      .map(([subcategory, number]) => (
                        <SidebarItem
                          key={subcategory}
                          name={subcategory}
                          number={number}
                          needTranslate={false}
                          active={
                            searchParams.get('subcategory') === subcategory
                          }
                          onClick={() => {
                            setSearchParams({
                              ...Object.fromEntries(searchParams.entries()),
                              subcategory
                            })
                            setOpen(false)
                          }}
                          onCancelButtonClick={() => {
                            setSearchParams({
                              ...Object.fromEntries(searchParams.entries()),
                              subcategory: ''
                            })
                            setOpen(false)
                          }}
                        />
                      ))}
                    <SidebarDivider />
                  </>
                )
              })()}
            <SidebarTitle name="Brands" />
            {Object.entries(sidebarData.brands)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([brand, number]) => (
                <SidebarItem
                  key={brand}
                  name={brand === '' ? 'Unknown' : brand}
                  number={number}
                  needTranslate={false}
                  active={searchParams.get('brand') === brand}
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      brand: brand === '' ? 'unknown' : brand
                    })
                    setOpen(false)
                  }}
                  onCancelButtonClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      brand: ''
                    })
                    setOpen(false)
                  }}
                />
              ))}
            <SidebarDivider />
            <SidebarTitle name="Sizes" />
            {Object.entries(sidebarData.sizes)
              .sort((a, b) => b[1] - a[1])
              .map(([size, number]) => (
                <SidebarItem
                  key={size}
                  name={size}
                  number={number}
                  needTranslate={false}
                  active={searchParams.get('size') === size}
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      size
                    })
                    setOpen(false)
                  }}
                  onCancelButtonClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      size: ''
                    })
                    setOpen(false)
                  }}
                />
              ))}
            <SidebarDivider />
            <SidebarTitle name="Colors" />
            {Object.entries(sidebarData.colors)
              .sort((a, b) => b[1] - a[1])
              .map(([color, number]) => (
                <SidebarItem
                  key={color}
                  name={color}
                  number={number}
                  needTranslate={false}
                  active={searchParams.get('color') === color}
                  sideStripColor={VW_COLORS.find(c => c.name === color)?.hex}
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      color
                    })
                    setOpen(false)
                  }}
                  onCancelButtonClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      color: ''
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
