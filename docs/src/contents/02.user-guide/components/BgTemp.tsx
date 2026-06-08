import {
  Box,
  Card,
  Flex,
  Ring,
  Text,
  surface,
  usePersonalization
} from '@lifeforge/ui'

const COLORS = ['slate', 'gray', 'zinc', 'neutral', 'stone'] as const

function BgTemp() {
  const { bgTemp, setBgTemp } = usePersonalization()

  return (
    <Card bg={{ ...surface.light, base: 'bg-50' }} mt="lg">
      <Flex
        align="center"
        direction={{ base: 'column', md: 'row' }}
        gap="sm"
        justify="between"
        width="100%"
      >
        <Text as="h3" size="xl" weight="semibold">
          Background Temperature Preview
        </Text>
        <Flex align="center" gap="sm" p="sm">
          {COLORS.map((color, index) => (
            <Ring
              key={index}
              asChild
              r="full"
              ringColor="bg-100"
              ringOffsetWidth="2px"
              ringWidth={bgTemp.replace('bg-', '') === color ? '1.5px' : '0px'}
            >
              <Box
                as="button"
                bg={`${color}-500`}
                height="1.5em"
                r="full"
                tabIndex={-1}
                width="1.5em"
                onClick={() => {
                  setBgTemp(`bg-${color}`)
                }}
              />
            </Ring>
          ))}
        </Flex>
      </Flex>
      <Box
        key={bgTemp}
        alt=""
        as="img"
        mt="md"
        r="md"
        src={`https://raw.githubusercontent.com/LifeForge-app/lifeforge-docs-media/main/assets/bgTemp/${COLORS.indexOf(bgTemp.replace('bg-', '') as (typeof COLORS)[number]) + 1}.webp`}
        width="100%"
      />
    </Card>
  )
}

export default BgTemp
