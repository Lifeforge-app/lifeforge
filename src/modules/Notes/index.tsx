import React from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import Loading from '../../components/general/Loading'
import Error from '../../components/general/Error'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Link } from 'react-router-dom'
import useFetch from '../../hooks/useFetch'
import ModuleWrapper from '../../components/general/ModuleWrapper'

export interface INotesWorkspace {
  collectionId: string
  collectionName: string
  created: string
  icon: string
  id: string
  name: string
  updated: string
}

function Notes(): React.ReactElement {
  const [data] = useFetch<INotesWorkspace[]>('notes/workspace/list')

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Notes"
        desc="A place to store all your involuntarily generated thoughts."
      />
      {(() => {
        if (data === 'loading') {
          return <Loading />
        } else if (data === 'error') {
          return <Error message="Failed to fetch data from server." />
        } else {
          return (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] items-center justify-center gap-4 py-8">
              {data.map(workspace => (
                <Link
                  to={`/notes/${workspace.id}`}
                  key={workspace.id}
                  className="group flex h-full  w-full flex-col items-center rounded-lg bg-bg-50 p-16 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800"
                >
                  <Icon
                    icon={workspace.icon}
                    className="h-20 w-20 shrink-0 group-hover:text-custom-500"
                  />
                  <h2 className="mt-6 text-center text-2xl font-medium uppercase tracking-widest">
                    {workspace.name}
                  </h2>
                </Link>
              ))}
            </div>
          )
        }
      })()}
    </ModuleWrapper>
  )
}

export default Notes
