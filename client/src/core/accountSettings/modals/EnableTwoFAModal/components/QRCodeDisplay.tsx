import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { toast } from '@lifeforge/ui'

import { decrypt } from '@lifeforge/api'
import { Box, Flex, LoadingScreen, usePersonalization } from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function QRCodeDisplay() {
  const { bgTempPalette, derivedTheme } = usePersonalization()

  const [link, setLink] = useState('')

  async function fetchLink() {
    try {
      const challenge = await forgeAPI.user['2fa'].getChallenge.query()

      const link = await forgeAPI.user['2fa'].generateAuthenticatorLink.query()

      const decrypted1 = decrypt(link, localStorage.getItem('session')!)

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
      <Flex
        centered
        shadow
        bg={{
          base: 'bg-100',
          dark: 'bg-800'
        }}
        p={{ base: 'lg', sm: '2xl' }}
        r="lg"
        style={{
          aspectRatio: '1/1'
        }}
      >
        {link ? (
          <Box asChild height="100%" width="100%">
            <QRCodeSVG
              bgColor="transparent"
              fgColor={
                derivedTheme === 'dark'
                  ? bgTempPalette[100]
                  : bgTempPalette[800]
              }
              value={link}
            />
          </Box>
        ) : (
          <LoadingScreen />
        )}
      </Flex>
    </>
  )
}

export default QRCodeDisplay
