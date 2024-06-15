import { Icon } from '@iconify/react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import useFetch from '@hooks/useFetch'
import {
  type IIdeaBoxFolder,
  type IIdeaBoxContainer
} from '@interfaces/ideabox_interfaces'

function ContainerHeader({
  id,
  viewArchived,
  setViewArchived,
  folderId
}: {
  id: string
  viewArchived: boolean
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>
  folderId?: string
}): React.ReactElement {
  const [containerDetails] = useFetch<IIdeaBoxContainer>(
    `idea-box/container/get/${id}`
  )
  const [folderDetails] = useFetch<IIdeaBoxFolder>(
    `idea-box/folder/get/${folderId}`,
    folderId !== undefined
  )
  const navigate = useNavigate()

  return (
    <header className="flex flex-col gap-1 px-8 sm:px-12">
      <GoBackButton
        onClick={() => {
          if (viewArchived) {
            setViewArchived(false)
            return
          }
          navigate(`/idea-box/${folderId !== undefined ? id : ''}`)
        }}
      />
      <div className="flex items-center justify-between">
        <h1
          className={`flex items-center gap-4 ${
            typeof containerDetails !== 'string'
              ? 'text-2xl sm:text-3xl'
              : 'text-2xl'
          } font-semibold `}
        >
          {(() => {
            switch (containerDetails) {
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
                        backgroundColor: containerDetails.color + '20'
                      }}
                    >
                      <Icon
                        icon={containerDetails.icon}
                        className="text-2xl sm:text-3xl"
                        style={{
                          color: containerDetails.color
                        }}
                      />
                    </div>
                    {viewArchived && 'Archived ideas in '}
                    {containerDetails.name}
                  </>
                )
            }
          })()}
          {folderId !== undefined && (
            <Icon
              icon="tabler:chevron-right"
              className="size-5 shrink-0 text-bg-500"
            />
          )}
          {folderId !== undefined &&
            (() => {
              switch (folderDetails) {
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
                  return folderDetails !== undefined ? (
                    <div
                      className="flex items-center gap-2 rounded-lg p-3 text-base"
                      style={{
                        backgroundColor: folderDetails.color + '20',
                        color: folderDetails.color
                      }}
                    >
                      <Icon
                        icon={folderDetails.icon}
                        className="shrink-0 text-xl"
                      />
                      <span className="hidden md:block">
                        {folderDetails.name}
                      </span>
                    </div>
                  ) : (
                    'Folder'
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
