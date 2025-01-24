import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { t } from 'i18next'
import { cookieParse } from 'pocketbase'
import React, { useRef } from 'react'
import { type Id, toast } from 'react-toastify'
import { Button , FAB } from '@components/buttons'
import HamburgerSelectorWrapper from '@components/buttons/HamburgerMenu/components/HamburgerSelectorWrapper'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import { SidebarDivider } from '@components/layouts/sidebar'
import useThemeColors from '@hooks/useThemeColor'
import APIRequest from '@utils/fetchData'
import IntervalManager from '@utils/intervalManager'

const intervalManager = IntervalManager.getInstance()

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function Header({
  refreshEntries,
  totalItems,
  setGuitarWorldModalOpen,
  searchParams,
  setSearchParams,
  view,
  setView
}: {
  refreshEntries: () => void
  totalItems: number
  setGuitarWorldModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchParams: URLSearchParams
  setSearchParams: (params: Record<string, string> | URLSearchParams) => void
  view: 'grid' | 'list'
  setView: React.Dispatch<React.SetStateAction<'grid' | 'list'>>
}): React.ReactElement {
  const toastId = useRef<Id>(null)
  const { theme } = useThemeColors()

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
                      refreshEntries()
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
              background: theme
            }
          })
        }
      }, 0)
    }
  }

  async function downloadAll(): Promise<void> {
    await APIRequest({
      endpoint: '/guitar-tabs/entries/download-all',
      method: 'GET',
      successInfo: 'NASFilesReady',
      failureInfo: 'download'
    })
  }

  return (
    <>
      <ModuleHeader
        title="Guitar Tabs"
        icon="mingcute:guitar-line"
        totalItems={totalItems}
        actionButton={
          <Menu as="div" className="relative z-50 hidden md:block">
            <Button
              onClick={() => {}}
              icon="tabler:plus"
              className="hidden md:flex"
              as={MenuButton}
            >
              Add Score
            </Button>
            <MenuItems
              transition
              anchor="bottom end"
              className="mt-2 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:bg-bg-800"
            >
              <MenuItem
                onClick={uploadFiles}
                icon="tabler:upload"
                text="Upload from device"
              />
              <MenuItem
                onClick={() => {
                  setGuitarWorldModalOpen(true)
                }}
                icon="mingcute:guitar-line"
                text="Download from Guitar World"
              />
            </MenuItems>
          </Menu>
        }
        hamburgerMenuItems={
          <>
            <MenuItem
              text="Download All"
              icon="tabler:download"
              onClick={downloadAll}
            />
            <div className="block md:hidden">
              <SidebarDivider noMargin />
              <HamburgerSelectorWrapper
                icon="tabler:sort-ascending"
                title="Sort by"
              >
                {SORT_TYPE.map(([icon, id]) => (
                  <MenuItem
                    key={id}
                    icon={icon}
                    text={t(`sortType.${id}`)}
                    onClick={() => {
                      searchParams.set('sort', id)
                      setSearchParams(searchParams)
                    }}
                    isToggled={
                      searchParams.get('sort') === id ||
                      (id === 'newest' && !searchParams.has('sort'))
                    }
                    needTranslate={false}
                  />
                ))}
              </HamburgerSelectorWrapper>
              <SidebarDivider noMargin />
              <HamburgerSelectorWrapper icon="tabler:eye" title="View as">
                {['grid', 'list'].map(type => (
                  <MenuItem
                    key={type}
                    text={type.charAt(0).toUpperCase() + type.slice(1)}
                    icon={type === 'grid' ? 'uil:apps' : 'uil:list-ul'}
                    onClick={() => {
                      setView(type as 'grid' | 'list')
                    }}
                    isToggled={view === type}
                    needTranslate={false}
                  />
                ))}
              </HamburgerSelectorWrapper>
            </div>
          </>
        }
        tips="If you want to append audio and Musescore files to your guitar tabs, make sure to name them the same as the PDF file and upload them together."
      />
      <FAB onClick={uploadFiles} icon="tabler:plus" />
    </>
  )
}

export default Header
