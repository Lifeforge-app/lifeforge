import { decrypt } from '@security/utils/encryption'
import forgeAPI from '@utils/forgeAPI'
import { parse as parseCookie } from 'cookie'
import { LoadingScreen } from 'lifeforge-ui'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { usePersonalization } from 'shared'

function QRCodeDisplay() {
  const { bgTempPalette, derivedTheme } = usePersonalization()

  const [link, setLink] = useState('')

  async function fetchLink() {
    try {
      const challenge = await forgeAPI.user['2fa'].getChallenge.query()

      const link = await forgeAPI.user['2fa'].generateAuthenticatorLink.query()

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
