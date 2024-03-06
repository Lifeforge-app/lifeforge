/* eslint-disable multiline-ternary */
import React from 'react'
import ModuleWrapper from '../../../components/general/ModuleWrapper'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Navigate } from 'react-router'
import GoBackButton from '../../../components/general/GoBackButton'

function AlbumGallery(): React.ReactElement {
  const projectData = 'loading'

  return (
    <ModuleWrapper>
      <div className="flex flex-col gap-1 pr-12">
        <GoBackButton
          onClick={() => {
            Navigate('/projects-k')
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
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-bg-800">
                        {projectData.thumbnail ? (
                          <img
                            src={`${
                              import.meta.env.VITE_POCKETBASE_ENDPOINT
                            }/api/files/${projectData.collectionId}/${
                              projectData.id
                            }/${projectData.thumbnail}?thumb=50x50`}
                            className="h-full w-full"
                          />
                        ) : (
                          <Icon
                            icon="tabler:brush"
                            className="h-7 w-7 text-bg-500"
                          />
                        )}
                      </div>
                      {projectData.name}
                    </>
                  )
              }
            })()}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
              <Icon icon="tabler:bulb" className="text-2xl" />
            </button>
            <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
              <Icon icon="tabler:share" className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </ModuleWrapper>
  )
}

export default AlbumGallery
