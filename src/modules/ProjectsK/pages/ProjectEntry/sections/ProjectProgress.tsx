import { Icon } from '@iconify/react'
import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import {
  type IProjectsKEntry,
  type IProjectsKProgress
} from '@interfaces/projects_k_interfaces'
import APIRequest from '@utils/fetchData'

export default function ProjectProgress({
  projectData
}: {
  projectData: IProjectsKEntry | 'loading' | 'error'
}): React.ReactElement {
  const [progress, refreshProgress] = useFetch<IProjectsKProgress>(
    `projects-k/progress/get/${(projectData as IProjectsKEntry).id}`,
    (projectData as IProjectsKEntry).id !== undefined
  )

  async function completeStep(state: 1 | -1): Promise<void> {
    await APIRequest({
      endpoint: `projects-k/progress/${state === -1 ? 'un' : ''}complete-step/${
        (projectData as IProjectsKEntry).id
      }`,
      method: 'PATCH',
      successInfo:
        state === -1
          ? 'Step reverted.'
          : 'Yay! You are one step closer to completing the project.',
      failureInfo: 'update',
      finalCallback: refreshProgress
    })
  }

  return (
    <APIComponentWithFallback data={projectData}>
      {() => (
        <div className="mb-8 mt-6 flex size-full min-h-0 pr-8 sm:pr-12">
          <APIComponentWithFallback data={progress}>
            {progress => (
              <div className="flex w-full flex-col px-6">
                <div className="flex-between flex">
                  <div className="flex items-center">
                    <Icon icon="tabler:chart-bar" className="text-3xl" />
                    <h2 className="ml-4 text-xl font-semibold">
                      Steps Completed
                    </h2>
                  </div>
                  <p className="flex items-end gap-2 text-5xl font-semibold">
                    {progress.completed}
                    <span className="text-2xl font-medium text-bg-500">
                      /{progress.steps.length}
                    </span>
                  </p>
                </div>
                <ul className="mt-6 space-y-2">
                  {progress.steps.map((id: string, index: number) => (
                    <li
                      key={id}
                      className={`flex-between relative flex gap-2 rounded-md p-6 ${
                        index < progress.completed
                          ? 'bg-bg-900'
                          : 'bg-bg-900/50'
                      } ${
                        index === progress.completed ? 'hover:bg-bg-800/50' : ''
                      }`}
                    >
                      <div
                        className={`flex items-center gap-4 ${
                          index < progress.completed
                            ? 'text-bg-50'
                            : 'text-bg-500'
                        }`}
                      >
                        <Icon
                          icon={progress.expand.steps[id].icon}
                          className="text-2xl"
                        />
                        {progress.expand.steps[id].name}
                      </div>
                      {index < progress.completed + 1 && (
                        <button
                          disabled={index < progress.completed - 1}
                          onClick={() => {
                            completeStep(
                              index < progress.completed ? -1 : 1
                            ).catch(console.error)
                          }}
                          className={`flex-center relative z-50 flex size-6 rounded-full border-2 transition-all hover:border-custom-500 ${
                            index < progress.completed
                              ? 'border-custom-500 bg-custom-500'
                              : 'border-bg-500 bg-bg-50 hover:border-bg-100 dark:bg-bg-900'
                          }`}
                        >
                          {index < progress.completed && (
                            <Icon
                              icon="uil:check"
                              className="size-4 stroke-bg-900 stroke-1 text-bg-800"
                            />
                          )}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </APIComponentWithFallback>
        </div>
      )}
    </APIComponentWithFallback>
  )
}
