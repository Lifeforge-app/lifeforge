import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'

import {
  Box,
  Flex,
  LoadingScreen,
  toast,
  usePersonalization
} from '@lifeforge/ui'

import forgeAPI from '@/forgeAPI'

function QRCodeDisplay({ onTid }: { onTid: (tid: string) => void }) {
  const { bgTempPalette, derivedTheme } = usePersonalization()
  const [link, setLink] = useState('')

  async function fetchLink() {
    try {
      const { tid, link } =
        await forgeAPI.auth['2fa'].generate.mutateRaw(undefined)

      onTid(tid)
      setLink(link)
    } catch {
      toast.error('Failed to fetch QR code')
    }
  }

  useEffect(() => {
    fetchLink()
  }, [])

  return (
    <Flex
      centered
      shadow
      bg={{ base: 'bg-100', dark: 'bg-800' }}
      p={{ base: 'lg', sm: '2xl' }}
      r="lg"
      style={{ aspectRatio: '1/1' }}
    >
      {link ? (
        <Box asChild height="100%" width="100%">
          <QRCodeSVG
            bgColor="transparent"
            fgColor={
              derivedTheme === 'dark' ? bgTempPalette[100] : bgTempPalette[800]
            }
            value={link}
          />
        </Box>
      ) : (
        <LoadingScreen />
      )}
    </Flex>
  )
}

export default QRCodeDisplay
