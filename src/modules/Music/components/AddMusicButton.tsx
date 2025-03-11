import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { useMusicContext } from '@providers/MusicProvider'
import IntervalManager from '@utils/intervalManager'
import { cookieParse } from 'pocketbase'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button, MenuItem } from '@lifeforge/ui'

const intervalManager = IntervalManager.getInstance()

function AddMusicButton(): React.ReactElement {
  const { t } = useTranslation('modules.music')
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
      <Button
        as={MenuButton}
        icon="tabler:plus"
        tProps={{ item: t('items.music') }}
        onClick={() => {}}
      >
        new
      </Button>
      <MenuItems
        transition
        anchor="bottom end"
        className="bg-bg-100 dark:bg-bg-800 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 mt-2 w-64 overflow-hidden overscroll-contain rounded-md shadow-lg transition duration-100 ease-out"
      >
        <MenuItem
          icon={loading ? 'svg-spinners:180-ring' : 'uil:import'}
          namespace="modules.music"
          text="Import from NAS"
          onClick={importMusic}
        />
        <div className="border-bg-300 dark:border-bg-700 w-full border-b" />
        <MenuItem
          icon="tabler:brand-youtube"
          namespace="modules.music"
          text="Download from YouTube"
          onClick={() => {
            setIsYoutubeDownloaderOpen(true)
          }}
        />
      </MenuItems>
    </Menu>
  )
}

export default AddMusicButton
