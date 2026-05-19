import { LoadingScreen } from 'lifeforge-ui'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { usePersonalization } from 'shared'
import { decrypt } from 'shared'

import forgeAPI from '@/forgeAPI'

function QRCodeDisplay() {
  const { bgTempPalette, derivedTheme } = usePersonalization()

  const [link, setLink] = useState('')

  async function fetchLink() {
    try {
      const challenge = await forgeAPI.untyped('user/2fa/getChallenge').query()

      const rawLink = await forgeAPI
        .untyped('user/2fa/generateAuthenticatorLink')
        .query()

      const sessionToken = localStorage.getItem('session')

      if (!sessionToken) {
        throw new Error('No session token found for decrypting authenticator link')
      }

      // Decrypt outer layer with session token, then inner with challenge
      const decrypted1 = decrypt(String(rawLink), sessionToken)

      const decrypted2 = decrypt(decrypted1, String(challenge))

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
