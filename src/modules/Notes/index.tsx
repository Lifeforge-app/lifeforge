import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import ErrorScreen from '@components/Screens/ErrorScreen'
import LoadingScreen from '@components/Screens/LoadingScreen'
import useFetch from '@hooks/useFetch'
import { type INotesWorkspace } from '@interfaces/notes_interfaces'

function Notes(): React.ReactElement {
  const [bounded, setBounded] = useState(false)
  const [data] = useFetch<INotesWorkspace[]>('notes/workspace/list', bounded)

  useEffect(() => {
    setBounded(true)
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:notebook"
        title="Notes"
        desc="A place to store all your involuntarily generated thoughts."
      />
      {(() => {
        if (data === 'loading') {
          return <LoadingScreen />
        } else if (data === 'error') {
          return <ErrorScreen message="Failed to fetch data from server." />
        } else {
          return (
            <div className="flex-center grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 py-8">
              {data.map(workspace => (
                <Link
                  to={`/notes/${workspace.id}`}
                  key={workspace.id}
                  className="group flex size-full  flex-col items-center rounded-lg bg-bg-50 p-16 shadow-custom hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800"
                >
                  <Icon
                    icon={workspace.icon}
                    className="size-20 shrink-0 group-hover:text-custom-500"
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
