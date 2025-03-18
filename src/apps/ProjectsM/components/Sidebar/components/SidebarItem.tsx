import {
  type IProjectsMCategory,
  type IProjectsMStatus,
  type IProjectsMTechnology,
  type IProjectsMVisibility
} from '@apps/ProjectsM/interfaces/projects_m_interfaces'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { MenuItem, SidebarItem } from '@lifeforge/ui'

import { useProjectsMContext } from '../../../providers/ProjectsMProvider'

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
}) {
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
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:pencil"
              text="Edit"
              onClick={e => {
                e.stopPropagation()
                setExistedData(item as any)
                setModifyDataModalOpenType('update')
              }}
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete"
              onClick={e => {
                e.stopPropagation()
                setExistedData(item as any)
                setDeleteDataConfirmationOpen(true)
              }}
            />
          </>
        }
        icon={item.icon}
        name={item.name}
        needTranslate={false}
        number={Math.floor(Math.random() * 100)}
        sideStripColor={
          stuff === 'statuses' ? (item as IProjectsMStatus).color : undefined
        }
        onCancelButtonClick={() => {
          searchParams.delete(singleStuff)
          setSearchParams(searchParams)
          setSidebarOpen(false)
        }}
        onClick={() => {
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            [singleStuff]: item.id
          })
          setSidebarOpen(false)
        }}
      />
    </>
  )
}

export default _SidebarItem
