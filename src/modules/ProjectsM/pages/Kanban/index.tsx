import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import ProjectHeader from './components/ProjectHeader'

function Kanban(): React.ReactElement {
  const navigate = useNavigate()
  const { id } = useParams()
  const [valid] = useFetch<boolean>(`projects-m/entry/valid/${id}`)

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/idea-box')
    }
  }, [valid])

  return (
    <ModuleWrapper>
      <APIComponentWithFallback data={valid}>
        {() => (
          <>
            <ProjectHeader />
            <div className="mb-12 mt-6 flex min-h-0 min-w-0 flex-1 gap-4 overflow-x-auto overflow-y-hidden">
              {[
                ['tabler:brain', 'Brainstorm', 'border-fuchsia-500'],
                ['tabler:settings', 'In Progress', 'border-yellow-500'],
                ['tabler:check', 'Done', 'border-green-500'],
                ['tabler:bug', 'Bugs', 'border-red-500']
              ].map(([icon, name, color], i) => (
                <div
                  key={i}
                  className={`flex h-min max-h-full w-72 shrink-0 flex-col rounded-lg border-t-4 bg-bg-50 p-6 pb-0 pr-4 dark:bg-bg-900 ${color}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-4">
                      <Icon icon={icon} className="text-2xl" />
                      <span className="text-xl font-semibold ">{name}</span>
                    </h3>
                    <button className="rounded-lg p-2 hover:bg-bg-700/50">
                      <Icon icon="tabler:dots-vertical" className="text-xl" />
                    </button>
                  </div>
                  <ul className="mt-6 space-y-2 overflow-y-auto pr-2">
                    {Array(Math.floor(Math.random() * 10))
                      .fill(0)
                      .map((_, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-4 rounded-lg bg-bg-100 p-4 shadow-[2px_2px_3px_rgba(0,0,0,0.05)] hover:bg-bg-700/50 dark:bg-bg-700/30"
                        >
                          <span className="">
                            {
                              [
                                'Lorem ipsum dolor sit amet',
                                'consectetur adipiscing elit',
                                'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
                                'Ut enim ad minim veniam'
                              ][Math.floor(Math.random() * 4)]
                            }
                          </span>
                        </li>
                      ))}
                    <li className="flex-center flex">
                      <button className="mb-4 flex w-full items-center gap-2 rounded-lg border-bg-500 p-4 pl-3 font-medium text-bg-500 hover:bg-bg-700/30">
                        <Icon icon="tabler:plus" className="text-xl" />
                        <span>Add a card</span>
                      </button>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default Kanban
