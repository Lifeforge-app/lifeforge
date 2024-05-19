/* eslint-disable @typescript-eslint/no-misused-promises */
import { Menu, Transition } from '@headlessui/react'
import { cookieParse } from 'pocketbase'
import React from 'react'
import { toast } from 'react-toastify'
import Button from '@components/Button'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import { useMusicContext } from '@providers/MusicProvider'
import IntervalManager from '../../../utils/intervalManager'

const intervalManager = IntervalManager.getInstance()

function AddMusicButton(): React.ReactElement {
  const { loading, setIsYoutubeDownloaderOpen, setLoading, refreshMusics } =
    useMusicContext()

  async function checkImportProgress(): Promise<
    'completed' | 'failed' | 'in_progress'
  > {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/music/entry/import-status`,
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
      return data.data.status
    }
    return 'failed'
  }

  function importMusic(): void {
    setLoading(true)

    fetch(`${import.meta.env.VITE_API_HOST}/music/entry/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async res => {
        if (res.status === 202) {
          const data = await res.json()
          if (data.state === 'accepted') {
            intervalManager.setInterval(async () => {
              const success = await checkImportProgress()
              switch (success) {
                case 'completed':
                  toast.success('Music downloaded successfully!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  refreshMusics()
                  break
                case 'failed':
                  toast.error('Failed to download music!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  break
              }
            }, 3000)
          }
        } else {
          const data = await res.json()
          setLoading(false)
          throw new Error(`Failed to download music. Error: ${data.message}`)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't download music! Error: ${err}`)
        setLoading(false)
      })
  }

  return (
    <Menu as="div" className="relative z-50 hidden md:block">
      <Button CustomElement={Menu.Button} icon="tabler:plus">
        add music
      </Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        className="absolute right-0 top-8"
      >
        <Menu.Items className="mt-8 w-64 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-none focus:outline-none dark:bg-bg-800">
          <MenuItem
            onClick={importMusic}
            icon={loading ? 'svg-spinners:180-ring' : 'uil:import'}
            text="Import from NAS"
          />
          <div className="w-full border-b border-bg-300 dark:border-bg-700" />
          <MenuItem
            onClick={() => {
              setIsYoutubeDownloaderOpen(true)
            }}
            icon="tabler:brand-youtube"
            text="Download from YouTube"
          />
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default AddMusicButton
