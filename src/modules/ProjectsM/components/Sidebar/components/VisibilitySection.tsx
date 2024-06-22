import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { type IProjectsMVisibility } from '@interfaces/projects_m_interfaces'
import VisibilityItem from './VisibilityItem'

function VisibilitySection({
  visibilities,
  setExistedData,
  setModifyVisibilityModalOpenType,
  setSidebarOpen
}: {
  visibilities: IProjectsMVisibility[] | 'loading' | 'error'
  setExistedData: React.Dispatch<
    React.SetStateAction<IProjectsMVisibility | null>
  >
  setModifyVisibilityModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <>
      <SidebarTitle
        name="visibility"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setExistedData(null)
          setModifyVisibilityModalOpenType('create')
        }}
      />
      <APIComponentWithFallback data={visibilities}>
        {typeof visibilities !== 'string' &&
          (visibilities.length > 0 ? (
            visibilities.map(item => (
              <VisibilityItem
                key={item.id}
                item={item}
                setExistedData={setExistedData}
                setModifyModalOpenType={setModifyVisibilityModalOpenType}
                setSidebarOpen={setSidebarOpen}
              />
            ))
          ) : (
            <p className="text-center text-bg-500">No visibility found.</p>
          ))}
      </APIComponentWithFallback>
    </>
  )
}

export default VisibilitySection
