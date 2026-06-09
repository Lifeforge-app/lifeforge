import _ from 'lodash'

import {
  Bordered,
  Box,
  Flex,
  Listbox,
  ListboxOption,
  Text,
  surface
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

const COLORS = [
  'bg-slate',
  'bg-gray',
  'bg-zinc',
  'bg-neutral',
  'bg-stone',
  'bg-mauve',
  'bg-olive',
  'bg-mist',
  'bg-taupe'
]

function DefaultBgTempSelector({
  bgTemp,
  customBgTemp
}: {
  bgTemp: string
  customBgTemp: string
}) {
  const { changeBgTemp } = useUserPersonalization()

  return (
    <Listbox
      bg={surface.lightInteractive}
      minWidth="12em"
      renderContent={() => (
        <Flex
          align="center"
          gap="sm"
          maxWidth={{ base: 'none', md: '12em' }}
          minWidth="0"
        >
          <Box
            bg="bg-500"
            className={bgTemp}
            display="inline-block"
            flexShrink="0"
            height="1em"
            r="full"
            width="1em"
          />
          <Text truncate>
            {bgTemp.startsWith('#')
              ? 'Custom'
              : _.startCase(bgTemp.replace('bg-', ''))}
          </Text>
        </Flex>
      )}
      value={bgTemp.startsWith('#') ? 'bg-custom' : bgTemp}
      width="100%"
      onChange={color => {
        changeBgTemp(color === 'bg-custom' ? customBgTemp : color)
      }}
    >
      {COLORS.map(color => (
        <ListboxOption
          key={color}
          label={_.startCase(color.replace('bg-', ''))}
          renderColorAndIcon={() => (
            <Box
              bg="bg-500"
              className={color}
              display="inline-block"
              flexShrink="0"
              height="1em"
              r="full"
              width="1em"
            />
          )}
          value={color}
        />
      ))}
      <ListboxOption
        key="custom"
        label="Custom"
        renderColorAndIcon={() => (
          <Bordered
            borderColor="bg-500"
            borderWidth="2px"
            flexShrink="0"
            height="1em"
            r="full"
            width="1em"
          />
        )}
        value="bg-custom"
      />
    </Listbox>
  )
}

export default DefaultBgTempSelector
