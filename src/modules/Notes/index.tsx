import React, { useEffect, useState } from 'react'
import ModuleHeader from '../../components/general/ModuleHeader'
import { toast } from 'react-toastify'
import Loading from '../../components/general/Loading'
import Error from '../../components/general/Error'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Link } from 'react-router-dom'

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
  const [data, setData] = useState<INotesWorkspace[] | 'error' | 'loading'>(
    'loading'
  )

  function updateNotesWorkspace(): void {
    setData('loading')
    fetch(`${import.meta.env.VITE_API_HOST}/notes/workspace/list`)
      .then(async response => {
        const data = await response.json()
        setData(data.data)

        if (response.status !== 200) {
          throw data.message
        }
      })
      .catch(() => {
        setData('error')
        toast.error('Failed to fetch data from server.')
      })
  }

  useEffect(() => {
    updateNotesWorkspace()
  }, [])

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll px-12">
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
                  className="group flex h-full  w-full flex-col items-center rounded-lg bg-neutral-50 p-16 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-neutral-100 dark:bg-neutral-800/50 dark:hover:bg-neutral-800"
                >
                  <Icon
                    icon={workspace.icon}
                    className="h-20 w-20 shrink-0 group-hover:text-custom-500"
                  />
                  <h2 className="mt-8 text-center text-2xl font-medium uppercase tracking-widest">
                    {workspace.name}
                  </h2>
                </Link>
              ))}
            </div>
          )
        }
      })()}
    </section>
  )
}

export default Notes
