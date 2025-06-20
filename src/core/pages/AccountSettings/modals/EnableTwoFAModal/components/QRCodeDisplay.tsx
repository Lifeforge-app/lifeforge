import { usePersonalization } from '@providers/PersonalizationProvider'
import clsx from 'clsx'
import { parse as parseCookie } from 'cookie'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { LoadingScreen } from '@lifeforge/ui'

import { decrypt } from '@security/utils/encryption'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

function QRCodeDisplay() {
  const { componentBgLighter } = useComponentBg()
  const { bgTempPalette, derivedTheme } = usePersonalization()
  const [link, setLink] = useState('')

  async function fetchLink() {
    try {
      const challenge = await fetchAPI<string>('/user/2fa/challenge')
      const link = await fetchAPI<string>('/user/2fa/link')

      const decrypted1 = decrypt(
        link,
        parseCookie(document.cookie).session ?? ''
      )
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
          'flex-center mt-6 aspect-square w-full rounded-lg p-12',
          componentBgLighter
        )}
      >
        {link ? (
          <QRCodeSVG
            bgColor="transparent"
            className="size-full"
            fgColor={
              derivedTheme === 'dark' ? bgTempPalette[100] : bgTempPalette[800]
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
