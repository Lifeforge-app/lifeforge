import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { type IProjectsKEntry } from '..'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'

export default function ProjectProgress({
  projectData
}: {
  projectData: IProjectsKEntry | 'loading' | 'error'
}): React.JSX.Element {
  return (
    <APIComponentWithFallback data={projectData}>
      {typeof projectData !== 'string' && (
        <div className="mb-12 mt-8 flex h-full min-h-0 w-full pr-8 sm:pr-12">
          <div className="flex h-full min-h-0 w-4/12 flex-col items-center gap-4 p-4">
            <img
              src={`${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
                projectData.collectionId
              }/${projectData.id}/${projectData.thumbnail}`}
              className="rounded-md object-contain"
            />
            <span className="font-medium text-bg-500">Version #1</span>
          </div>
          <div className="flex w-full flex-col px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icon icon="tabler:chart-bar" className="text-3xl" />
                <h2 className="ml-4 text-xl font-semibold">Steps Completed</h2>
              </div>
              <p className="flex items-end gap-2 text-5xl font-semibold">
                2<span className="text-2xl font-medium text-bg-500">/5</span>
              </p>
            </div>
            <ul className="mt-6 flex flex-col gap-2">
              {[
                ['Draft', 'lucide:drafting-compass'],
                ['Line Art', 'lucide:pen-tool'],
                ['Base Color', 'lucide:paint-bucket'],
                ['Shading', 'lucide:layers-3'],
                ['Finalize', 'lucide:stars']
              ].map(([name, icon], index) => (
                <li
                  key={name}
                  className={
                    'relative flex items-center justify-between gap-2 rounded-md bg-bg-900 p-6'
                  }
                >
                  <div
                    className={`flex items-center gap-4 ${
                      index < 2 ? 'text-bg-100' : 'text-bg-500'
                    }`}
                  >
                    <Icon icon={icon} className="text-2xl" />
                    {name}
                  </div>
                  <button
                    onClick={() => {}}
                    className={`relative z-50 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all hover:border-custom-500 ${
                      index < 2
                        ? 'border-custom-500 bg-custom-500'
                        : 'border-bg-500 bg-bg-50 dark:bg-bg-900'
                    }`}
                  >
                    {index < 2 && (
                      <Icon
                        icon="uil:check"
                        className="h-4 w-4 stroke-bg-900 stroke-1 text-bg-900"
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </APIComponentWithFallback>
  )
}
