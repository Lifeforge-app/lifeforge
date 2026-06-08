import {
  Flex,
  Grid,
  Icon,
  Ring,
  Text,
  Transition,
  usePersonalization
} from '@lifeforge/ui'

const COLORS = [
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'grey'
] as const

function ThemeColors() {
  const { setRawThemeColor, rawThemeColor } = usePersonalization()

  return (
    <Grid gap="lg" mt="xl" templateCols={{ base: 2, sm: 3, md: 6 }}>
      {COLORS.map((color, index) => (
        <Flex
          key={`${color}-${index}`}
          centered
          as="button"
          direction="column"
          onClick={() => {
            setRawThemeColor(`theme-${color}`)
          }}
        >
          <Transition>
            <Ring
              asChild
              ringColor="custom-500"
              ringOffsetWidth={
                rawThemeColor === `theme-${color}` ? '3px' : '0px'
              }
              ringWidth={rawThemeColor === `theme-${color}` ? '2px' : '0px'}
            >
              <Flex
                align="center"
                bg="primary"
                className={`theme-${color}`}
                height="4rem"
                justify="center"
                r="full"
                width="4rem"
              >
                {rawThemeColor === `theme-${color}` ? (
                  <Icon
                    color={{ base: 'bg-100', dark: 'bg-900' }}
                    icon="tabler:check"
                    size="2rem"
                  />
                ) : null}
              </Flex>
            </Ring>
          </Transition>
          <Text color="muted" mt="sm" size="sm">
            {color}
          </Text>
        </Flex>
      ))}
    </Grid>
  )
}

export default ThemeColors
