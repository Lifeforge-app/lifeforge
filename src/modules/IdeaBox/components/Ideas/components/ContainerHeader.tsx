/* eslint-disable @typescript-eslint/member-delimiter-style */
import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import {
  type IIdeaBoxContainer,
  type IIdeaBoxFolder
} from '@interfaces/ideabox_interfaces'
import APIRequest from '@utils/fetchData'

function ContainerHeader({
  valid,
  viewArchived,
  setViewArchived
}: {
  valid: boolean | 'loading' | 'error'
  viewArchived: boolean
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
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
    <header className="space-y-1">
      <GoBackButton
        onClick={() => {
          if (viewArchived) {
            setViewArchived(false)
          }
          navigate(location.pathname.split('/').slice(0, -1).join('/'))
        }}
      />
      <div className="flex-between flex">
        <h1
          className={`flex items-center gap-4 ${
            typeof pathDetails !== 'string'
              ? 'text-2xl sm:text-3xl'
              : 'text-2xl'
          } font-semibold `}
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
                  <>
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
                    {pathDetails.path.length > 0 && (
                      <Icon
                        icon="tabler:chevron-right"
                        className="size-6 text-gray-500"
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
                          <span className="hidden md:block">{folder.name}</span>
                        </Link>
                        {index !== pathDetails.path.length - 1 && (
                          <Icon
                            icon="tabler:chevron-right"
                            className="size-6 text-gray-500"
                          />
                        )}
                      </>
                    ))}
                  </>
                )
            }
          })()}
        </h1>
        {!viewArchived && (
          <HamburgerMenu largerPadding className="relative">
            <MenuItem
              icon="tabler:archive"
              text="View Archived"
              onClick={() => {
                setViewArchived(true)
              }}
            />
          </HamburgerMenu>
        )}
      </div>
    </header>
  )
}

export default ContainerHeader
