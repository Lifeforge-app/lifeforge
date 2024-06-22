import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { type IProjectsMCategory } from '@interfaces/projects_m_interfaces'
import TechnologyItem from './TechnolofyItem'

function TechnologySection({
  technologies,
  setExistedData,
  setModifyTechnologyModalOpenType,
  setSidebarOpen
}: {
  technologies: IProjectsMCategory[] | 'loading' | 'error'
  setExistedData: React.Dispatch<
    React.SetStateAction<IProjectsMCategory | null>
  >
  setModifyTechnologyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  return (
    <>
      <SidebarTitle
        name="technologies"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setExistedData(null)
          setModifyTechnologyModalOpenType('create')
        }}
      />
      <APIComponentWithFallback data={technologies}>
        {typeof technologies !== 'string' &&
          (technologies.length > 0 ? (
            technologies.map(item => (
              <TechnologyItem
                key={item.id}
                item={item}
                setExistedData={setExistedData}
                setModifyModalOpenType={setModifyTechnologyModalOpenType}
                setSidebarOpen={setSidebarOpen}
              />
            ))
          ) : (
            <p className="text-center text-bg-500">No technology found.</p>
          ))}
      </APIComponentWithFallback>
    </>
  )
}

export default TechnologySection
