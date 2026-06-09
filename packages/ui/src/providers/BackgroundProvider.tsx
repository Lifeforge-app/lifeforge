import { BG_BLURS } from './PersonalizationProvider/constants/bg_blurs'
import { usePersonalization } from './PersonalizationProvider'

import { Box, Flex } from '@/components/primitives'

export function BackgroundProvider({
  children
}: {
  children: React.ReactNode
}) {
  const {
    bgImage,
    derivedTheme,
    backdropFilters: { brightness, blur, contrast, saturation, overlayOpacity }
  } = usePersonalization()

  return (
    <Flex
      height="100dvh"
      style={
        bgImage !== ''
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }
          : {}
      }
      width="100%"
    >
      {bgImage !== '' && (
        <Box
          height="100%"
          left="0"
          position="absolute"
          style={{
            backgroundColor: `color-mix(in oklab, var(--color-bg-${
              derivedTheme === 'dark' ? '950' : '50'
            }) ${overlayOpacity}%, transparent)`,
            backdropFilter:
              bgImage !== ''
                ? `brightness(${brightness}%) blur(${BG_BLURS[blur]}) contrast(${contrast}%) saturate(${saturation}%)`
                : ''
          }}
          top="0"
          width="100%"
          zIndex="-1"
        />
      )}

      {children}
    </Flex>
  )
}
