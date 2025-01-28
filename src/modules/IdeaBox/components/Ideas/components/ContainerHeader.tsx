import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GoBackButton } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import {
  type IIdeaBoxContainer,
  type IIdeaBoxFolder
} from '@interfaces/ideabox_interfaces'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import APIRequest from '@utils/fetchData'

function ContainerHeader(): React.ReactElement {
  const { valid, viewArchived, setViewArchived } = useIdeaBoxContext()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()
  const [pathDetails, setPathDetails] = useState<
    | {
        container: IIdeaBoxContainer
        path: IIdeaBoxFolder[]
      }
    | 'loading'
    | 'error'
  >('loading')
  const navigate = useNavigate()

  async function fetchPathDetails(): Promise<void> {
    setPathDetails('loading')
    await APIRequest({
      method: 'GET',
      endpoint: `idea-box/path/${id}/${path}`,
      callback: data => {
        setPathDetails(data.data)
      }
    })
  }

  useEffect(() => {
    if (valid === true) {
      fetchPathDetails().catch(console.error)
    }
  }, [valid, id, path])

  return (
    <header className="space-y-4">
      <div className="flex-between w-full">
        <GoBackButton
          onClick={() => {
            if (viewArchived) {
              setViewArchived(false)
            }
            navigate(location.pathname.split('/').slice(0, -1).join('/'))
          }}
        />
        <HamburgerMenu largerPadding className="relative">
          <MenuItem
            icon={viewArchived ? 'tabler:archive-off' : 'tabler:archive'}
            text={viewArchived ? 'View Active' : 'View Archived'}
            onClick={() => {
              setViewArchived(!viewArchived)
            }}
          />
        </HamburgerMenu>
      </div>
      <div
        style={{
          backgroundImage:
            typeof pathDetails !== 'string'
              ? `url(${import.meta.env.VITE_API_HOST}/media/${
                  pathDetails.container.cover
                })`
              : ''
        }}
        className="relative isolate flex h-56 w-full items-end justify-between rounded-lg bg-bg-900 bg-cover bg-center bg-no-repeat p-6 sm:h-72"
      >
        <div className="absolute inset-0 rounded-lg bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_80%)]"></div>
        <div className="flex-between relative z-9999 flex w-full">
          <h1
            className={`flex items-center gap-4 ${
              typeof pathDetails !== 'string'
                ? 'text-2xl sm:text-3xl'
                : 'text-2xl'
            } font-semibold text-bg-100`}
          >
            {(() => {
              switch (pathDetails) {
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
                        className="mt-0.5 size-7 text-red-500"
                      />
                      Failed to fetch data from server.
                    </>
                  )
                default:
                  return (
                    <div className="flex flex-wrap items-center gap-3">
                      <Link
                        to={`/idea-box/${id}`}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="rounded-lg p-3"
                          style={{
                            backgroundColor: pathDetails.container.color + '20'
                          }}
                        >
                          <Icon
                            icon={pathDetails.container.icon}
                            className="text-2xl sm:text-3xl"
                            style={{
                              color: pathDetails.container.color
                            }}
                          />
                        </div>
                        {viewArchived ? 'Archived ideas in ' : ''}
                        {pathDetails.container.name}
                      </Link>
                      {pathDetails.path.length > 0 && (
                        <Icon
                          icon="tabler:chevron-right"
                          className="size-5 text-gray-500"
                        />
                      )}
                      {pathDetails.path.map((folder, index) => (
                        <>
                          <Link
                            key={folder.id}
                            to={`/idea-box/${id}/${path
                              ?.split('/')
                              .slice(0, index + 1)
                              .join('/')
                              .replace('//', '/')}`}
                            className="relative flex items-center gap-2 rounded-lg p-3 text-base before:absolute before:left-0 before:top-0 before:size-full before:rounded-md before:transition-all hover:before:bg-white/5"
                            style={{
                              backgroundColor: folder.color + '20',
                              color: folder.color
                            }}
                          >
                            <Icon
                              icon={folder.icon}
                              className="shrink-0 text-xl"
                            />
                            <span className="hidden md:block">
                              {folder.name}
                            </span>
                          </Link>
                          {index !== pathDetails.path.length - 1 && (
                            <Icon
                              icon="tabler:chevron-right"
                              className="size-5 text-gray-500"
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

export default ContainerHeader
