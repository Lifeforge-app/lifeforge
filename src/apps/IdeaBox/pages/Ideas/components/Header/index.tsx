import { Icon } from '@iconify/react'
import { Link, useParams } from 'react-router'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import ContainerName from './components/ContainerName'
import GoBackButtonAndMenu from './components/GoBackButtonAndMenu'

function Header() {
  const { pathDetails, pathDetailsLoading, setSearchQuery, setSelectedTags } =
    useIdeaBoxContext()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  return (
    <header className="space-y-4">
      <GoBackButtonAndMenu />
      <div
        className="bg-bg-900 relative isolate flex h-56 w-full items-end justify-between rounded-lg bg-cover bg-center bg-no-repeat p-6 sm:h-72"
        style={{
          backgroundImage:
            typeof pathDetails !== 'string'
              ? `url(${import.meta.env.VITE_API_HOST}/media/${pathDetails?.container.cover.replace(
                  /^\//,
                  ''
                )})`
              : ''
        }}
      >
        <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_80%)]"></div>
        <div className="flex-between relative z-9999 flex w-full">
          <h1 className="text-bg-100 flex items-center gap-4 text-2xl font-semibold sm:text-3xl">
            {(() => {
              if (pathDetailsLoading) {
                return (
                  <>
                    <span className="small-loader-light"></span>
                    Loading...
                  </>
                )
              } else {
                return (
                  <div className="flex flex-wrap items-center gap-3">
                    <ContainerName
                      color={pathDetails!.container.color}
                      icon={pathDetails!.container.icon}
                      id={pathDetails!.container.id}
                      name={pathDetails!.container.name}
                    />
                    {pathDetails!.path.length > 0 && (
                      <Icon
                        className="size-5 text-gray-500"
                        icon="tabler:chevron-right"
                      />
                    )}
                    {pathDetails!.path.map((folder, index) => (
                      <>
                        <Link
                          key={folder.id}
                          className="relative flex items-center gap-2 rounded-lg p-3 text-base before:absolute before:top-0 before:left-0 before:size-full before:rounded-md before:transition-all hover:before:bg-white/5"
                          style={{
                            backgroundColor: folder.color + '20',
                            color: folder.color
                          }}
                          to={`/idea-box/${id}/${path
                            ?.split('/')
                            .slice(0, index + 1)
                            .join('/')
                            .replace('//', '/')}`}
                          onClick={() => {
                            setSelectedTags([])
                            setSearchQuery('')
                          }}
                        >
                          <Icon
                            className="shrink-0 text-xl"
                            icon={folder.icon}
                          />
                          <span className="hidden md:block">{folder.name}</span>
                        </Link>
                        {index !== pathDetails!.path.length - 1 && (
                          <Icon
                            className="size-5 text-gray-500"
                            icon="tabler:chevron-right"
                          />
                        )}
                      </>
                    ))}
                  </div>
                )
              }
            })()}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header
