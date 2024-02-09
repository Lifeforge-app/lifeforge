import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import GoBackButton from '../../../components/general/GoBackButton'
import { PROJECT_STATUS, type IProjectsKEntry } from '..'
import useFetch from '../../../hooks/useFetch'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import HamburgerMenu from '../../../components/general/HamburgerMenu'

function ProjectProgress({
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
                    className={`relative z-50 flex h-6 w-6 items-center justify-center rounded-full border-2 p-0.5 transition-all hover:border-custom-500 ${
                      index < 2
                        ? 'border-custom-500'
                        : 'border-bg-500 bg-bg-50 dark:bg-bg-900'
                    }`}
                  >
                    {index < 2 && (
                      <Icon
                        icon="uil:check"
                        className="h-3 w-3 stroke-custom-500 stroke-[2px] text-custom-500"
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

function ProjectVersions({
  projectData
}: {
  projectData: IProjectsKEntry | 'loading' | 'error'
}): React.JSX.Element {
  return (
    <APIComponentWithFallback data={projectData}>
      {typeof projectData !== 'string' && (
        <ul className="mb-12 mr-8 mt-8 grid grid-cols-[repeat(auto-fill,minmax(30.333%,1fr))] gap-6 sm:mr-12">
          <li className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-md border-4 border-dashed border-bg-700 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]">
            <Icon
              icon="tabler:plus"
              className="h-16 w-16 text-bg-400 dark:text-bg-700"
            />
            <div className="text-3xl font-semibold text-bg-400 dark:text-bg-700">
              Create new version
            </div>
          </li>
          <li className="relative flex h-min w-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
            <div className="relative w-full overflow-hidden rounded-lg">
              <div className="relative flex w-full justify-center">
                <img
                  src={`${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
                    projectData.collectionId
                  }/${projectData.id}/${projectData.thumbnail}?thumb=0x500`}
                  className="h-full w-auto rounded-md object-cover"
                />
              </div>
              <div className="mt-4 flex items-start justify-between ">
                <div className="flex w-full flex-col">
                  <h3 className="text-xl font-semibold text-bg-800 dark:text-bg-100">
                    Version #1
                  </h3>
                  <p className="mt-1 text-sm text-bg-500">
                    9 Feb 2024, 5:30 PM
                  </p>
                </div>
                <div className="relative z-[9999]">
                  <HamburgerMenu />
                </div>
              </div>
            </div>
            <button className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]   hover:bg-custom-600 dark:text-bg-800">
              <Icon icon="tabler:download" className="h-5 w-5 shrink-0" />
              <span className="shrink-0">download</span>
            </button>
          </li>
        </ul>
      )}
    </APIComponentWithFallback>
  )
}

function Project(): React.JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams()
  const [projectData] = useFetch<IProjectsKEntry>(`projects-k/entry/get/${id}`)
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) {
      navigate('#progress')
    }
  }, [location.hash])

  return (
    <section className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-y-auto pl-12">
      <div className="flex flex-col gap-1 pr-12">
        <GoBackButton
          onClick={() => {
            navigate('/projects-k')
          }}
        />
        <div className="flex items-center justify-between">
          <h1
            className={`flex items-center gap-4 ${
              typeof projectData !== 'string'
                ? 'text-2xl sm:text-3xl'
                : 'text-2xl'
            } font-semibold `}
          >
            {(() => {
              switch (projectData) {
                case 'loading':
                  return (
                    <>
                      <span className="small-loader-light"></span>
                      Loading...
                    </>
                  )
                case 'error':
                  return (
                    <>
                      <Icon
                        icon="tabler:alert-triangle"
                        className="mt-0.5 h-7 w-7 text-red-500"
                      />
                      Failed to fetch data from server.
                    </>
                  )
                default:
                  return (
                    <>
                      <div className="overflow-hidden rounded-md">
                        <img
                          src={`${
                            import.meta.env.VITE_POCKETBASE_ENDPOINT
                          }/api/files/${projectData.collectionId}/${
                            projectData.id
                          }/${projectData.thumbnail}?thumb=50x50`}
                        />
                      </div>
                      {projectData.name}
                      <div
                        className={`ml-2 rounded-full bg-yellow-500/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest ${
                          PROJECT_STATUS[projectData.status].bg
                        } ${
                          PROJECT_STATUS[projectData.status].text
                        } shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]`}
                      >
                        {PROJECT_STATUS[projectData.status].name}
                      </div>
                    </>
                  )
              }
            })()}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
              <Icon icon="tabler:share" className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-center pr-8 sm:pr-12">
        {[
          ['Progress', 'tabler:chart-bar', 'progress'],
          ['Versions', 'tabler:versions', 'versions'],
          ['Payments', 'tabler:credit-card', 'payments']
        ].map(([name, icon, id]) => (
          <button
            key={id}
            onClick={() => {
              navigate(`#${id}`)
            }}
            className={`flex w-full items-center justify-center gap-2 p-6 text-bg-500 transition-all hover:text-bg-800 dark:hover:text-bg-100 ${
              location.hash === `#${id}`
                ? 'border-b-2 border-bg-100 !text-bg-100'
                : ''
            }`}
          >
            <Icon icon={icon} className="text-2xl" />
            {name}
          </button>
        ))}
      </div>
      {
        {
          '#progress': <ProjectProgress projectData={projectData} />,
          '#versions': <ProjectVersions projectData={projectData} />,
          '#payments': 'Payments'
        }[location.hash]
      }
    </section>
  )
}

export default Project
