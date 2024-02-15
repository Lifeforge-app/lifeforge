/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { type IProjectsKEntry } from '..'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import useFetch from '../../../hooks/useFetch'
import { toast } from 'react-toastify'
import { cookieParse } from 'pocketbase'

export interface IProjectsKProgress {
  collectionId: string
  collectionName: string
  completed: number
  created: string
  expand: Expand
  id: string
  project: string
  steps: string[]
  updated: string
}

export interface Expand {
  steps: Record<string, Step>
}

export interface Step {
  id: string
  name: string
  icon: string
}

export default function ProjectProgress({
  projectData
}: {
  projectData: IProjectsKEntry | 'loading' | 'error'
}): React.JSX.Element {
  const [progress, refreshProgress] = useFetch<IProjectsKProgress>(
    `projects-k/progress/get/${(projectData as IProjectsKEntry).id}`,
    (projectData as IProjectsKEntry).id !== undefined
  )

  function completeStep(state: 1 | -1): void {
    fetch(
      `${import.meta.env.VITE_API_HOST}/projects-k/progress/${
        state === -1 ? 'un' : ''
      }complete-step/${(projectData as IProjectsKEntry).id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async res => {
        try {
          const data = await res.json()

          if (res.status !== 200 || data.state !== 'success') {
            throw data.message
          }
          refreshProgress()
          state === -1
            ? toast.info('Step reverted.')
            : toast.success(
                'Yay! You are one step closer to completing the project.'
              )
        } catch (err) {
          throw new Error(err as string)
        }
      })
      .catch(err => {
        toast.error("Oops! Couldn't update the progress. Please try again.")
        console.error(err)
      })
  }

  return (
    <APIComponentWithFallback data={projectData}>
      {typeof projectData !== 'string' && (
        <div className="mb-12 mt-8 flex h-full min-h-0 w-full pr-8 sm:pr-12">
          <APIComponentWithFallback data={progress}>
            {typeof progress !== 'string' && (
              <div className="flex w-full flex-col px-6">
                <div className="flex items-center justify-between">
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
                <ul className="mt-6 flex flex-col gap-2">
                  {progress.steps.map((id: string, index: number) => (
                    <li
                      key={id}
                      className={`relative flex items-center justify-between gap-2 rounded-md p-6 ${
                        index < progress.completed
                          ? 'bg-bg-900'
                          : 'bg-bg-900/50'
                      } ${
                        index === progress.completed && 'hover:bg-bg-800/50'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-4 ${
                          index < progress.completed
                            ? 'text-bg-100'
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
                            completeStep(index < progress.completed ? -1 : 1)
                          }}
                          className={`relative z-50 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all hover:border-custom-500 ${
                            index < progress.completed
                              ? 'border-custom-500 bg-custom-500'
                              : 'border-bg-500 bg-bg-50 hover:border-bg-100 dark:bg-bg-900'
                          }`}
                        >
                          {index < progress.completed && (
                            <Icon
                              icon="uil:check"
                              className="h-4 w-4 stroke-bg-900 stroke-1 text-bg-900"
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
