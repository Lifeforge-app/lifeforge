import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { type IProjectsMStatus } from '@interfaces/projects_m_interfaces'
import StatusItem from './StatusItem'

function StatusSection({
  statuses,
  setExistedData,
  setModifyStatusModalOpenType,
  setSidebarOpen
}: {
  statuses: IProjectsMStatus[] | 'loading' | 'error'
  setExistedData: React.Dispatch<React.SetStateAction<IProjectsMStatus | null>>
  setModifyStatusModalOpenType: React.Dispatch<'create' | 'update' | null>
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <>
      <SidebarTitle
        name="status"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setExistedData(null)
          setModifyStatusModalOpenType('create')
        }}
      />
      <APIComponentWithFallback data={statuses}>
        {typeof statuses !== 'string' &&
          statuses.map(item => (
            <StatusItem
              key={item.id}
              item={item}
              setExistedData={setExistedData}
              setModifyModalOpenType={setModifyStatusModalOpenType}
              setSidebarOpen={setSidebarOpen}
            />
          ))}
      </APIComponentWithFallback>
    </>
  )
}

export default StatusSection
