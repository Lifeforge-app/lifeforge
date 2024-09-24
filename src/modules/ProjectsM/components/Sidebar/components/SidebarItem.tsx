import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import {
  type IProjectsMStatus,
  type IProjectsMTechnology,
  type IProjectsMVisibility,
  type IProjectsMCategory
} from '@interfaces/projects_m_interfaces'
import { useProjectsMContext } from '@providers/ProjectsMProvider'

function _SidebarItem({
  item,
  stuff
}: {
  item:
    | IProjectsMCategory
    | IProjectsMVisibility
    | IProjectsMTechnology
    | IProjectsMStatus
  stuff: 'categories' | 'visibilities' | 'technologies' | 'statuses'
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    miscellaneous: { setSidebarOpen },
    ...projectMContext
  } = useProjectsMContext()

  const {
    setExistedData,
    setModifyDataModalOpenType,
    setDeleteDataConfirmationOpen
  } = projectMContext[stuff]

  const singleStuff = useMemo(
    () => stuff.replace(/ies$/, 'y').replace(/s$/, ''),
    [stuff]
  )

  return (
    <>
      <SidebarItem
        active={searchParams.get(singleStuff) === item.id}
        color={
          stuff === 'statuses' ? (item as IProjectsMStatus).color : undefined
        }
        icon={item.icon}
        name={item.name}
        needTranslate={false}
        number={Math.floor(Math.random() * 100)}
        onClick={() => {
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            [singleStuff]: item.id
          })
          setSidebarOpen(false)
        }}
        onCancelButtonClick={() => {
          setSearchParams(searchParams => {
            searchParams.delete(singleStuff)
            return searchParams
          })
          setSidebarOpen(false)
        }}
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:edit"
              onClick={e => {
                e.stopPropagation()
                setExistedData(item as any)
                setModifyDataModalOpenType('update')
              }}
              text="Edit"
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              onClick={e => {
                e.stopPropagation()
                setExistedData(item as any)
                setDeleteDataConfirmationOpen(true)
              }}
              text="Delete"
            />
          </>
        }
      />
    </>
  )
}

export default _SidebarItem
