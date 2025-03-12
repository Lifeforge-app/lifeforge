import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import { useQueryClient } from '@tanstack/react-query'
import fetchAPI from '@utils/fetchAPI'
import IntervalManager from '@utils/intervalManager'
import { cookieParse } from 'pocketbase'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'
import { type Id, toast } from 'react-toastify'

import {
  Button,
  FAB,
  HamburgerMenuSelectorWrapper,
  MenuItem,
  SidebarDivider
} from '@lifeforge/ui'
import { ModuleHeader } from '@lifeforge/ui'

const intervalManager = IntervalManager.getInstance()

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function Header({
  totalItems,
  setGuitarWorldModalOpen,
  view,
  setView,
  queryKey
}: {
  totalItems: number
  setGuitarWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  view: 'grid' | 'list'
  setView: React.Dispatch<React.SetStateAction<'grid' | 'list'>>
  queryKey: unknown[]
}): React.ReactElement {
  const queryClient = useQueryClient()
  const { t } = useTranslation('modules.guitarTabs')
  const [searchParams, setSearchParams] = useSearchParams()
  const toastId = useRef<Id>(null)
  const { themeColor } = usePersonalizationContext()

  async function uploadFiles(): Promise<void> {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.mp3,.mscz'
    input.onchange = async e => {
      const files = (e.target as HTMLInputElement).files

      const formData = new FormData()
      if (files !== null) {
        if (files.length > 100) {
          toast.error('You can only upload 100 files at a time!')
          return
        }

        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i], encodeURIComponent(files[i].name))
        }

        fetch(`${import.meta.env.VITE_API_HOST}/guitar-tabs/entries/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          },
          body: formData
        })
          .then(async res => {
            if (res.status === 202) {
              const data = await res.json()
              if (data.state === 'accepted') {
                intervalManager.setInterval(async () => {
                  const { status, left, total } = await checkUploadStatus()

                  switch (status) {
                    case 'completed':
                      if (toastId.current !== null) {
                        toast.done(toastId.current)
                        toastId.current = null
                      }
                      toast.success('Guitar tabs uploaded successfully!')
                      intervalManager.clearAllIntervals()
                      queryClient.invalidateQueries({ queryKey })
                      break
                    case 'in_progress':
                      updateProgressBar((total - left) / total)
                      break
                    case 'failed':
                      toast.error('Failed to upload guitar tabs!')
                      intervalManager.clearAllIntervals()
                      break
                  }
                }, 1000)
              }
            } else {
              const data = await res.json()
              throw new Error(
                `Failed to upload guitar tabs. Error: ${data.message}`
              )
            }
          })
          .catch(err => {
            toast.error(`Oops! Couldn't upload the guitar tabs! Error: ${err}`)
          })
      }
    }
    input.click()
  }

  async function checkUploadStatus(): Promise<{
    status: 'completed' | 'failed' | 'in_progress'
    left: number
    total: number
  }> {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/guitar-tabs/entries/process-status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return data.data
    }
    return {
      status: 'failed',
      left: 0,
      total: 0
    }
  }

  function updateProgressBar(progress: number): void {
    if (toastId.current === null) {
      toastId.current = toast('Upload in Progress', {
        progress,
        autoClose: false
      })
    } else {
      setTimeout(() => {
        if (toastId.current !== null) {
          toast.update(toastId.current, {
            progress,
            progressStyle: {
              background: themeColor
            }
          })
        }
      }, 0)
    }
  }

  async function downloadAll(): Promise<void> {
    try {
      await fetchAPI('guitar-tabs/entries/download-all')

      toast.success('Guitar tabs are being downloaded!')
    } catch {
      toast.error('Failed to download guitar tabs!')
    }
  }

  return (
    <>
      <ModuleHeader
        actionButton={
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              as={MenuButton}
              className="hidden md:flex"
              icon="tabler:plus"
              tProps={{ item: t('items.score') }}
              onClick={() => {}}
            >
              new
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="bg-bg-100 dark:bg-bg-800 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 mt-2 overflow-hidden overscroll-contain rounded-md shadow-lg transition duration-100 ease-out"
            >
              <MenuItem
                icon="tabler:upload"
                namespace="modules.guitarTabs"
                text="Upload from local"
                onClick={uploadFiles}
              />
              <MenuItem
                icon="mingcute:guitar-line"
                namespace="modules.guitarTabs"
                text="Download from Guitar World"
                onClick={() => {
                  setGuitarWorldModalOpen(true)
                }}
              />
            </MenuItems>
          </Menu>
        }
        hamburgerMenuItems={
          <>
            <MenuItem
              icon="tabler:download"
              namespace="modules.guitarTabs"
              text="Download All"
              onClick={downloadAll}
            />
            <div className="block md:hidden">
              <SidebarDivider noMargin />
              <HamburgerMenuSelectorWrapper
                icon="tabler:sort-ascending"
                title="Sort by"
              >
                {SORT_TYPE.map(([icon, id]) => (
                  <MenuItem
                    key={id}
                    icon={icon}
                    isToggled={
                      searchParams.get('sort') === id ||
                      (id === 'newest' && !searchParams.has('sort'))
                    }
                    text={t(`sortType.${id}`)}
                    onClick={() => {
                      searchParams.set('sort', id)
                      setSearchParams(searchParams)
                    }}
                  />
                ))}
              </HamburgerMenuSelectorWrapper>
              <SidebarDivider noMargin />
              <HamburgerMenuSelectorWrapper icon="tabler:eye" title="View as">
                {['grid', 'list'].map(type => (
                  <MenuItem
                    key={type}
                    icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
                    isToggled={view === type}
                    text={type.charAt(0).toUpperCase() + type.slice(1)}
                    onClick={() => {
                      setView(type as 'grid' | 'list')
                    }}
                  />
                ))}
              </HamburgerMenuSelectorWrapper>
            </div>
          </>
        }
        icon="mingcute:guitar-line"
        tips="If you want to append audio and Musescore files to your guitar tabs, make sure to name them the same as the PDF file and upload them together."
        title="Guitar Tabs"
        totalItems={totalItems}
      />
      <FAB icon="tabler:plus" onClick={uploadFiles} />
    </>
  )
}

export default Header
