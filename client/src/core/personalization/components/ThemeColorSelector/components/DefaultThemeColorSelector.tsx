import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import {
  Bordered,
  Box,
  Flex,
  Listbox,
  ListboxOption,
  Text
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

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
]

function DefaultThemeColorSelector({
  themeColor,
  customThemeColor
}: {
  themeColor: string
  customThemeColor: string
}) {
  const { t } = useTranslation('common.personalization')

  const { changeThemeColor } = useUserPersonalization()

  return (
    <Listbox
      bg={{
        base: 'bg-100',
        hover: 'bg-200',
        dark: 'bg-800',
        darkHover: 'bg-700'
      }}
      minWidth="16em"
      renderContent={() => (
        <Flex align="center" gap="sm" maxWidth="16em" minWidth="0">
          <Bordered
            bg={!themeColor.startsWith('#') ? 'custom-500' : undefined}
            borderColor="bg-500"
            borderWidth={themeColor.startsWith('#') ? '2px' : '0px'}
            display="inline-block"
            flexShrink="0"
            height="1em"
            r="full"
            width="1em"
          />
          <Text truncate>
            {t(
              `themeColorSelector.colors.${
                !themeColor.startsWith('#')
                  ? _.camelCase(
                      themeColor
                        .split('-')
                        .slice(1)
                        .map(e => e[0].toUpperCase() + e.slice(1))
                        .join(' ')
                    )
                  : 'custom'
              }`
            )}
          </Text>
        </Flex>
      )}
      value={themeColor.startsWith('#') ? 'theme-custom' : themeColor}
      onChange={color => {
        changeThemeColor(color === 'theme-custom' ? customThemeColor : color)
      }}
    >
      {COLORS.map(color => (
        <ListboxOption
          key={color}
          label={t(
            `themeColorSelector.colors.${_.camelCase(
              color
                .split('-')
                .map(e => e[0].toUpperCase() + e.slice(1))
                .join(' ')
            )}`
          )}
          renderColorAndIcon={() => (
            <Box
              bg="custom-500"
              className={`theme-${color}`}
              display="inline-block"
              flexShrink="0"
              height="1em"
              r="full"
              width="1em"
            />
          )}
          value={`theme-${color}`}
        />
      ))}
      <ListboxOption
        key="custom"
        label={t('themeColorSelector.colors.custom')}
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
        value="theme-custom"
      />
    </Listbox>
  )
}

export default DefaultThemeColorSelector
