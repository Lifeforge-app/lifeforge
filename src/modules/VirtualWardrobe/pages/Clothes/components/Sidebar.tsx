import VW_CATEGORIES from '@constants/virtual_wardrobe_categories'
import VW_COLORS from '@constants/virtual_wardrobe_colors'
import { UseQueryResult } from '@tanstack/react-query'
import React from 'react'
import { useSearchParams } from 'react-router'

import {
  QueryWrapper,
  SidebarDivider,
  SidebarItem,
  SidebarTitle,
  SidebarWrapper
} from '@lifeforge/ui'

import { type IVirtualWardrobeSidebarData } from '@interfaces/virtual_wardrobe_interfaces'

function Sidebar({
  isOpen,
  setOpen,
  sidebarDataQuery
}: {
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  sidebarDataQuery: UseQueryResult<IVirtualWardrobeSidebarData>
}): React.ReactElement {
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
              namespace="modules.virtualWardrobe"
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
              namespace="modules.virtualWardrobe"
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
            <SidebarTitle
              name="Categories"
              namespace="modules.virtualWardrobe"
            />
            {Object.entries(sidebarData.categories)
              .sort((a, b) => b[1] - a[1])
              .map(([category, number]) => (
                <SidebarItem
                  key={category}
                  active={searchParams.get('category') === category}
                  icon={
                    VW_CATEGORIES.find(cat => cat.name === category)?.icon ?? ''
                  }
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
                    <SidebarTitle
                      name="Subcategories"
                      namespace="modules.virtualWardrobe"
                    />
                    {Object.entries(sidebarData.subcategories)
                      .filter(([subcategory]) =>
                        allSubcategories.includes(subcategory)
                      )
                      .sort((a, b) => b[1] - a[1])
                      .map(([subcategory, number]) => (
                        <SidebarItem
                          key={subcategory}
                          active={
                            searchParams.get('subcategory') === subcategory
                          }
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
              })()}
            <SidebarTitle name="Brands" namespace="modules.virtualWardrobe" />
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
            <SidebarDivider />
            <SidebarTitle name="Sizes" namespace="modules.virtualWardrobe" />
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
            <SidebarDivider />
            <SidebarTitle name="Colors" namespace="modules.virtualWardrobe" />
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
        )}
      </QueryWrapper>
    </SidebarWrapper>
  )
}

export default Sidebar
