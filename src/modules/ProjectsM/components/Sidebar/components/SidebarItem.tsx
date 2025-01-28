import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SidebarItem } from '@components/layouts/sidebar'
import {
  type IProjectsMCategory,
  type IProjectsMStatus,
  type IProjectsMTechnology,
  type IProjectsMVisibility
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
        sideStripColor={
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
          searchParams.delete(singleStuff)
          setSearchParams(searchParams)
          setSidebarOpen(false)
        }}
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:pencil"
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
