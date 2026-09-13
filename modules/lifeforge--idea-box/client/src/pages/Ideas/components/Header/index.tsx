import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Link, useParams } from 'react-router'

import { Icon } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import { useIdeaBoxContext } from '@/providers/IdeaBoxProvider'

import ContainerName from './components/ContainerName'
import GoBackButtonAndMenu from './components/GoBackButtonAndMenu'

function Header() {
  const { setSearchQuery, setSelectedTags, pathValid } = useIdeaBoxContext()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const pathDetailsQuery = useQuery(
    forgeAPI.misc.getPath
      .input({
        container: id || '',
        folder: path?.split('/').pop() ?? undefined
      })
      .queryOptions({
        enabled: id !== undefined && pathValid
      })
  )

  const pathDetails = pathDetailsQuery.data

  return (
    <header className="space-y-3">
      <GoBackButtonAndMenu />
      <div
        className={clsx(
          'relative isolate flex h-56 w-full items-end justify-between rounded-lg bg-cover bg-center bg-no-repeat p-6 sm:h-72',
          pathDetails?.container.cover
            ? 'bg-bg-900'
            : 'bg-bg-200 dark:bg-bg-800'
        )}
        style={
          pathDetails?.container.cover
            ? {
                backgroundImage:
                  pathDetails?.container &&
                  `url(${forgeAPI.getMedia({
                    collectionId: pathDetails.container.collectionId,
                    recordId: pathDetails.container.id,
                    fieldId: pathDetails.container.cover
                  })})`
              }
            : undefined
        }
      >
        {pathDetails?.container.cover && (
          <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_80%)]"></div>
        )}
        <div className="flex-between relative z-9999 flex w-full">
          <h1
            className={clsx(
              'flex items-center gap-3 text-2xl font-semibold sm:text-3xl',
              pathDetails?.container.cover
                ? 'text-bg-100'
                : 'text-bg-900 dark:text-bg-100'
            )}
          >
            {(() => {
              if (!pathDetails) {
                return (
                  <>
                    <Icon
                      className="text-bg-500 size-5"
                      icon="svg-spinners:ring-resize"
                    />
                    Loading...
                  </>
                )
              } else {
                return (
                  <div className="flex flex-wrap items-center gap-3">
                    <ContainerName
                      color={pathDetails.container.color}
                      icon={pathDetails.container.icon}
                      id={pathDetails.container.id}
                      name={pathDetails.container.name}
                    />
                    {pathDetails.route.length > 0 && (
                      <Icon
                        className="size-5 text-gray-500"
                        icon="tabler:chevron-right"
                      />
                    )}
                    {pathDetails.route.map((folder, index) => (
                      <>
                        <Link
                          key={folder.id}
                          className="relative flex items-center gap-2 rounded-lg p-3 text-base before:absolute before:top-0 before:left-0 before:size-full before:rounded-md before:transition-all hover:before:bg-white/5 in-[.bordered]:border-2"
                          style={{
                            borderColor: folder.color + '20',
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
                        {index !== pathDetails.route.length - 1 && (
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
