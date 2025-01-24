import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IProjectsMEntry } from '@interfaces/projects_m_interfaces'
import ProjectHeader from './components/ProjectHeader'
import ProjectKanban from './components/ProjectKanban'

function Kanban(): React.ReactElement {
  const navigate = useNavigate()
  const { id } = useParams()
  const [valid] = useFetch<boolean>(`projects-m/entries/valid/${id}`)
  const [projectData] = useFetch<IProjectsMEntry>(
    `projects-m/entries/${id}`,
    valid === true
  )

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/projects-m')
    }
  }, [valid])

  return (
    <ModuleWrapper>
      <APIFallbackComponent data={valid}>
        {() => (
          <APIFallbackComponent data={projectData}>
            {projectData => (
              <>
                <ProjectHeader projectData={projectData} />
                <ProjectKanban />
              </>
            )}
          </APIFallbackComponent>
        )}
      </APIFallbackComponent>
    </ModuleWrapper>
  )
}

export default Kanban
