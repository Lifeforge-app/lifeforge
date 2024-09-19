import { t } from 'i18next'
import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import SidebarItem from './SidebarItem'

function SidebarSection({
  stuff
}: {
  stuff: 'categories' | 'technologies' | 'visibilities' | 'statuses'
}): React.ReactElement {
  const { data, setExistedData, setModifyDataModalOpenType } =
    useProjectsMContext()[stuff]

  return (
    <>
      <SidebarTitle
        name={stuff}
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
                <SidebarItem key={item.id} item={item} stuff={stuff} />
              ))}
            </>
          ) : (
            <p className="text-center text-bg-500">
              {t(`emptyState.${stuff}`)}
            </p>
          )
        }
      </APIComponentWithFallback>
    </>
  )
}

export default SidebarSection
