import { decrypt } from '@security/utils/encryption'
import { parse as parseCookie } from 'cookie'
import { LoadingScreen } from 'lifeforge-ui'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { usePersonalization } from 'shared/lib'
import { fetchAPI } from 'shared/lib'

function QRCodeDisplay() {
  const { bgTempPalette, derivedTheme } = usePersonalization()

  const [link, setLink] = useState('')

  async function fetchLink() {
    try {
      const challenge = await fetchAPI<string>(
        import.meta.env.VITE_API_HOST,
        '/user/2fa/challenge'
      )

      const link = await fetchAPI<string>(
        import.meta.env.VITE_API_HOST,
        '/user/2fa/link'
      )

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
      <div className="flex-center component-bg-lighter mt-6 aspect-square w-full rounded-lg p-12">
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
