import { usePersonalization } from '@providers/PersonalizationProvider'
import clsx from 'clsx'
import { cookieParse } from 'pocketbase'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import { LoadingScreen } from '@lifeforge/ui'

import { decrypt } from '@security/utils/encryption'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

function QRCodeDisplay() {
  const { componentBgLighter } = useComponentBg()
  const { bgTempPalette, theme } = usePersonalization()
  const finalTheme = useMemo(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }

    return theme
  }, [theme])
  const [link, setLink] = useState('')

  async function fetchLink() {
    try {
      const challenge = await fetchAPI<string>('/user/2fa/challenge')
      const link = await fetchAPI<string>('/user/2fa/link')

      const decrypted1 = decrypt(link, cookieParse(document.cookie).token)
      const decrypted2 = decrypt(decrypted1, challenge)

      setLink(decrypted2)
    } catch {
      toast.error('Failed to fetch QR code')
    }
  }

  useEffect(() => {
    fetchLink()
  }, [])

  return (
    <>
      <div
        className={clsx(
          'aspect-square w-full flex-center p-12 rounded-lg mt-6',
          componentBgLighter
        )}
      >
        {link ? (
          <QRCodeSVG
            bgColor="transparent"
            className="size-full"
            fgColor={
              finalTheme === 'dark' ? bgTempPalette[100] : bgTempPalette[800]
            }
            value={link}
          />
        ) : (
          <LoadingScreen />
        )}
      </div>
    </>
  )
}

export default QRCodeDisplay
