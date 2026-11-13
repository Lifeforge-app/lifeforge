import { useTranslation } from 'react-i18next'

import { Card } from '@/components/layout'
import { ModalHeader } from '@/components/overlays'
import { Box, Flex, Grid, Stack, Text } from '@/components/primitives'
import { surface } from '@/system'

import { ColorSwatch } from './components/ColorSwatch'
import { CHINESE_TRADITIONAL_COLORS } from './constants/chinese_colors'

function ChineseTraditionalColorsModal({
  data: { color, setColor },
  onClose
}: {
  data: {
    color: string
    setColor: (color: string) => void
  }
  onClose: () => void
}) {
  const { t } = useTranslation(['common.modals'])

  return (
    <Box minWidth="70vw">
      <ModalHeader
        icon="tabler:brush"
        title="colorPicker.modals.chineseTraditionalColors"
        onClose={onClose}
      />
      <Flex direction="column" gap="xl">
        {CHINESE_TRADITIONAL_COLORS.map(({ group, colors }) => (
          <Stack key={group} gap="sm">
            <Flex align="center" gap="sm" pl="md" position="relative">
              <Box
                bg="custom-500"
                bottom="0"
                left="0"
                position="absolute"
                r="full"
                top="0"
                width="0.25em"
              />
              <Text as="h2" size="lg" weight="semibold">
                {t(`colorPicker.groups.${group}`)}
              </Text>
            </Flex>
            <Card bg={surface.light} overflow="hidden" p="none" width="100%">
              <Grid
                gap="sm"
                p="md"
                templateCols="repeat(auto-fill, minmax(6em, 1fr))"
                width="100%"
              >
                {colors.map(({ name, value }, index) => (
                  <ColorSwatch
                    key={`${group}-${index}`}
                    name={name}
                    selected={color.toLowerCase() === value.toLowerCase()}
                    value={value}
                    onSelect={() => {
                      setColor(value)
                      onClose()
                    }}
                  />
                ))}
              </Grid>
            </Card>
          </Stack>
        ))}
      </Flex>
    </Box>
  )
}

export { ChineseTraditionalColorsModal }
