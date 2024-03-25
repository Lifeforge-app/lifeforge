/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { type IIdeaBoxContainer } from '../../..'
import GoBackButton from '../../../../../components/general/GoBackButton'
import useFetch from '../../../../../hooks/useFetch'
import HamburgerMenu from '../../../../../components/general/HamburgerMenu'
import MenuItem from '../../../../../components/general/HamburgerMenu/MenuItem'

function ContainerHeader({
  id,
  viewArchived,
  setViewArchived
}: {
  id: string
  viewArchived: boolean
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
  const [containerDetails] = useFetch<IIdeaBoxContainer>(
    `idea-box/container/get/${id}`
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
          navigate('/idea-box')
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
                      className="mt-0.5 h-7 w-7 text-red-500"
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
        </h1>
        {!viewArchived && (
          <HamburgerMenu largerPadding position="relative">
            <MenuItem
              icon="tabler:archive"
              text="Archived"
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
