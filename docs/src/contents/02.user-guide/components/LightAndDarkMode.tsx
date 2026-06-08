import { usePersonalization } from '@lifeforge/ui'
import {
  Box,
  Card,
  Flex,
  Icon,
  Text,
  colorWithOpacity,
  surface
} from '@lifeforge/ui'

function LightAndDarkMode() {
  const { derivedTheme, setTheme } = usePersonalization()

  return (
    <Card shadow bg={{ ...surface.light, base: 'bg-50' }} mt="lg">
      <Flex
        align="center"
        direction={{ base: 'column', md: 'row' }}
        gap="sm"
        justify="between"
      >
        <Flex align="center" as="h3" gap="sm" width="100%">
          <Icon icon="tabler:sun-moon" size="2rem" />
          <Text as="span" size="xl" weight="semibold">
            Light/Dark Theme Preview
          </Text>
        </Flex>
        <Flex
          shadow
          bg={{
            base: colorWithOpacity('bg-200', '50%'),
            dark: colorWithOpacity('bg-700', '50%')
          }}
          gap="xs"
          p="sm"
          r="md"
          width={{ base: '100%', md: 'auto' }}
        >
          <Flex
            asChild
            align="center"
            bg={derivedTheme === 'light' ? 'custom-500' : 'transparent'}
            gap="sm"
            justify="center"
            p="sm"
            r="md"
            width="50%"
          >
            <Text
              as="button"
              color={derivedTheme === 'light' ? 'bg-800' : 'muted'}
              weight="medium"
              onClick={() => setTheme('light')}
            >
              <Icon icon="uil:sun" size="1.25rem" />
              Light
            </Text>
          </Flex>
          <Flex
            asChild
            align="center"
            bg={derivedTheme === 'dark' ? 'custom-500' : undefined}
            gap="sm"
            justify="center"
            p="sm"
            r="md"
            width="50%"
          >
            <Text
              as="button"
              color={derivedTheme === 'dark' ? 'bg-800' : 'muted'}
              weight="medium"
              onClick={() => setTheme('dark')}
            >
              <Icon icon="uil:moon" size="1.25rem" />
              Dark
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Box
        key={derivedTheme}
        alt=""
        as="img"
        mt="md"
        r="md"
        src={`https://raw.githubusercontent.com/LifeForge-app/lifeforge-docs-media/main/assets/colors/${derivedTheme}.webp`}
        width="100%"
      />
    </Card>
  )
}

export default LightAndDarkMode
