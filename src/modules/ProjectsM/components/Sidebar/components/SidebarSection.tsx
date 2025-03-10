import React from 'react'
import { useTranslation } from 'react-i18next'
import { SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import SidebarItem from './SidebarItem'

function SidebarSection({
  stuff
}: {
  stuff: 'categories' | 'technologies' | 'visibilities' | 'statuses'
}): React.ReactElement {
  const { t } = useTranslation('modules.projectsM')
  const { data, setExistedData, setModifyDataModalOpenType } =
    useProjectsMContext()[stuff]

  return (
    <>
      <SidebarTitle
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setExistedData(null)
          setModifyDataModalOpenType('create')
        }}
        name={stuff}
        namespace="modules.projectsM"
      />
      <APIFallbackComponent data={data}>
        {data =>
          data.length > 0 ? (
            <>
              {data.map(item => (
                <SidebarItem key={item.id} item={item} stuff={stuff} />
              ))}
            </>
          ) : (
            <p className="text-bg-500 text-center">{t(`empty.${stuff}`)}</p>
          )
        }
      </APIFallbackComponent>
    </>
  )
}

export default SidebarSection
