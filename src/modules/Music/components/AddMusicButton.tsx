import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { cookieParse } from 'pocketbase'
import React from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { useMusicContext } from '@providers/MusicProvider'
import IntervalManager from '@utils/intervalManager'

const intervalManager = IntervalManager.getInstance()

function AddMusicButton(): React.ReactElement {
  const { loading, setIsYoutubeDownloaderOpen, setLoading, refreshMusics } =
    useMusicContext()

  async function checkImportProgress(): Promise<
    'completed' | 'failed' | 'in_progress'
  > {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/music/entries/import-status`,
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

    fetch(`${import.meta.env.VITE_API_HOST}/music/entries/import`, {
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
                  toast.success('Music imported successfully!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  refreshMusics()
                  break
                case 'failed':
                  toast.error('Failed to import music!')
                  intervalManager.clearAllIntervals()
                  setLoading(false)
                  break
              }
            }, 3000)
          }
        } else {
          const data = await res.json()
          setLoading(false)
          throw new Error(`Failed to import music. Error: ${data.message}`)
        }
      })
      .catch(err => {
        toast.error(`Oops! Couldn't import music! Error: ${err}`)
        setLoading(false)
      })
  }

  return (
    <Menu as="div" className="relative z-50 hidden md:block">
      <Button onClick={() => {}} as={MenuButton} icon="tabler:plus">
        add music
      </Button>
      <MenuItems
        transition
        anchor="bottom end"
        className="mt-2 w-64 overflow-hidden overscroll-contain rounded-md bg-bg-100 shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
      >
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
      </MenuItems>
    </Menu>
  )
}

export default AddMusicButton
