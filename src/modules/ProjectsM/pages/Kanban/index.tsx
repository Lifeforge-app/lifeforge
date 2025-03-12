import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import { APIFallbackComponent } from '@lifeforge/ui'
import { ModuleWrapper } from '@lifeforge/ui'

import { type IProjectsMEntry } from '@modules/ProjectsM/interfaces/projects_m_interfaces'

import useFetch from '@hooks/useFetch'

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
