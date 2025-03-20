import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'

import { ModuleWrapper, QueryWrapper } from '@lifeforge/ui'

import { type IProjectsMEntry } from '@apps/ProjectsM/interfaces/projects_m_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

import ProjectHeader from './components/ProjectHeader'
import ProjectKanban from './components/ProjectKanban'

function Kanban() {
  const navigate = useNavigate()
  const { id } = useParams()
  const validQuery = useAPIQuery<boolean>(`projects-m/entries/valid/${id}`, [
    'projects-m',
    'entries',
    'valid',
    id
  ])
  const projectDataQuery = useAPIQuery<IProjectsMEntry>(
    `projects-m/entries/${id}`,
    ['projects-m', 'entries', id],
    validQuery.data === true
  )

  useEffect(() => {
    if (typeof validQuery.data === 'boolean' && !validQuery.data) {
      toast.error('Invalid ID')
      navigate('/projects-m')
    }
  }, [validQuery.data])

  return (
    <ModuleWrapper>
      <QueryWrapper query={validQuery}>
        {() => (
          <QueryWrapper query={projectDataQuery}>
            {projectData => (
              <>
                <ProjectHeader projectData={projectData} />
                <ProjectKanban />
              </>
            )}
          </QueryWrapper>
        )}
      </QueryWrapper>
    </ModuleWrapper>
  )
}

export default Kanban
