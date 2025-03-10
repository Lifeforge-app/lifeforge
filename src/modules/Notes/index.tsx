import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import ErrorScreen from '@components/screens/ErrorScreen'
import LoadingScreen from '@components/screens/LoadingScreen'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type INotesWorkspace } from '@interfaces/notes_interfaces'

function Notes(): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const [bounded, setBounded] = useState(false)
  const [data] = useFetch<INotesWorkspace[]>('notes/workspace/list', bounded)

  useEffect(() => {
    setBounded(true)
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:notebook" title="Notes" />
      {(() => {
        if (data === 'loading') {
          return <LoadingScreen />
        } else if (data === 'error') {
          return <ErrorScreen message="Failed to fetch data from server." />
        } else {
          return (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,1fr))] gap-4 py-8">
              {data.map(workspace => (
                <Link
                  key={workspace.id}
                  className={clsx(
                    'group shadow-custom flex size-full flex-col items-center rounded-lg p-16',
                    componentBgWithHover
                  )}
                  to={`/notes/${workspace.id}`}
                >
                  <Icon
                    className={clsx(
                      'size-20 shrink-0 transition-all',
                      'group-hover:text-custom-500'
                    )}
                    icon={workspace.icon}
                  />
                  <h2 className="mt-6 text-center text-2xl font-medium tracking-widest uppercase">
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
