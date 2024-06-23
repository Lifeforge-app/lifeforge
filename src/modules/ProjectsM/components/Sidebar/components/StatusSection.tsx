import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import StatusItem from './StatusItem'

function StatusSection(): React.ReactElement {
  const { data, setExistedData, setModifyDataModalOpenType } =
    useProjectsMContext().statuses

  return (
    <>
      <SidebarTitle
        name="status"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setExistedData(null)
          setModifyDataModalOpenType('create')
        }}
      />
      <APIComponentWithFallback data={data}>
        {data =>
          data.length > 0 ? (
            <>
              {data.map(item => (
                <StatusItem key={item.id} item={item} />
              ))}
            </>
          ) : (
            <p className="text-center text-bg-500">No status found.</p>
          )
        }
      </APIComponentWithFallback>
    </>
  )
}

export default StatusSection
