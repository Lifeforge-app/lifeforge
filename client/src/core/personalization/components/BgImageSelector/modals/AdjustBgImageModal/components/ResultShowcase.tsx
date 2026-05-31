import { usePersonalization } from '@lifeforge/shared'
import { Box, Flex, Icon, Stack, Text, colorWithOpacity, surface } from '@lifeforge/ui'

import { BG_BLURS } from '../constants/bg_blurs'

function ResultShowcase({
  bgBrightness,
  bgBlur,
  bgContrast,
  bgSaturation,
  overlayOpacity
}: {
  bgBrightness: number
  bgBlur: keyof typeof BG_BLURS
  bgContrast: number
  bgSaturation: number
  overlayOpacity: number
}) {
  const { bgImage } = usePersonalization()

  return (
    <Box
      shadow
      height="21rem"
      maxHeight="21rem"
      overflow="hidden"
      position="relative"
      r="md"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        isolation: 'isolate'
      }}
      width="100%"
    >
      <Box
        height="100%"
        p="xl"
        style={{
          backdropFilter: `brightness(${bgBrightness}%) blur(${BG_BLURS[bgBlur]}) contrast(${bgContrast}%) saturate(${bgSaturation}%)`
        }}
        width="100%"
      >
        <Stack
          shadow
          bg={surface.default}
          height="100%"
          p="md"
          r="lg"
          width="100%"
        >
          <Box
            shadow
            bg={{ base: 'bg-50', dark: 'bg-950' }}
            height="100%"
            position="absolute"
            style={{
              inset: 0,
              opacity: `${overlayOpacity}%`,
              zIndex: '-1',
              borderRadius: 'inherit'
            }}
            width="100%"
          />
          <Flex align="center" gap="sm" position="relative" zIndex="2">
            <Icon icon="tabler:box" size="1.5em" />
            <Text as="h1" size="xl" weight="semibold">
              Lorem ipsum dolor sit amet
            </Text>
          </Flex>
          <Text as="p" color="muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac.
          </Text>
          <Flex
            align="center"
            bg={surface.light}
            direction={{ base: 'column', sm: 'row' }}
            gap="md"
            mt="md"
            p="md"
            position="relative"
            r="lg"
          >
            <Flex
              align="center"
              bg={colorWithOpacity('custom-500', '20%')}
              flexShrink="0"
              justify="center"
              p="md"
              r="md"
            >
              <Icon color="custom-500" icon="tabler:box" size="2em" />
            </Flex>
            <Box>
              <Text as="h2" size="lg" weight="semibold">
                Lorem ipsum dolor
              </Text>
              <Text as="p" color="muted">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                ac.
              </Text>
            </Box>
          </Flex>
        </Stack>
      </Box>
    </Box>
  )
}

export default ResultShowcase
