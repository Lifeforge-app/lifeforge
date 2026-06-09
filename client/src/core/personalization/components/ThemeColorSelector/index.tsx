import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  ColorInput,
  Flex,
  OptionsColumn,
  Text,
  usePersonalization
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

import DefaultThemeColorSelector from './components/DefaultThemeColorSelector'

function ThemeColorSelector() {
  const { rawThemeColor: themeColor } = usePersonalization()

  const { changeThemeColor } = useUserPersonalization()

  const [customThemeColor, setCustomThemeColor] = useState<string>(
    themeColor.startsWith('#') ? themeColor : '#000000'
  )

  const { t } = useTranslation(['common.personalization', 'common.buttons'])

  return (
    <OptionsColumn
      breakpoint={themeColor.startsWith('#') ? 'lg' : 'md'}
      description={t('themeColorSelector.desc')}
      icon="tabler:palette"
      title={t('themeColorSelector.title')}
    >
      <Flex
        align="center"
        direction={{ base: 'column', sm: 'row' }}
        gap="md"
        width="100%"
      >
        <DefaultThemeColorSelector
          customThemeColor={customThemeColor}
          themeColor={themeColor}
        />
        {themeColor.startsWith('#') && (
          <>
            <Box width={{ base: '100%', lg: '16em' }}>
              <ColorInput
                label="Color Hex"
                namespace="common.personalization"
                value={customThemeColor}
                onChange={setCustomThemeColor}
              />
            </Box>
            {themeColor !== customThemeColor &&
              customThemeColor.match(/^#[0-9A-F]{6}$/i) !== null && (
                <Button
                  icon="uil:save"
                  width={{ base: '100%', lg: 'auto' }}
                  onClick={() => {
                    changeThemeColor(customThemeColor)
                  }}
                >
                  <Text display={{ base: 'inline', lg: 'none' }}>
                    {t('common.buttons:save')}
                  </Text>
                </Button>
              )}
          </>
        )}
      </Flex>
    </OptionsColumn>
  )
}

export default ThemeColorSelector
