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

import DefaultBgTempSelector from './components/DefaultBgTempSelector'

function BgTempSelector() {
  const { bgTemp } = usePersonalization()

  const { changeBgTemp } = useUserPersonalization()

  const [customBgTemp, setCustomBgTemp] = useState<string>(
    bgTemp.startsWith('#') ? bgTemp : '#000000'
  )

  const { t } = useTranslation(['common.personalization', 'common.buttons'])

  return (
    <OptionsColumn
      breakpoint="md"
      description={t('bgTempSelector.desc')}
      icon="tabler:temperature"
      title={t('bgTempSelector.title')}
    >
      <Flex
        align="center"
        direction={{ base: 'column', sm: 'row' }}
        gap="md"
        width="100%"
      >
        <DefaultBgTempSelector bgTemp={bgTemp} customBgTemp={customBgTemp} />
        {bgTemp.startsWith('#') && (
          <>
            <Box width={{ base: '100%', lg: '16em' }}>
              <ColorInput
                label="Color Hex"
                namespace="common.personalization"
                value={customBgTemp}
                onChange={setCustomBgTemp}
              />
            </Box>
            {bgTemp !== customBgTemp &&
              customBgTemp.match(/^#[0-9A-F]{6}$/i) !== null && (
                <Button
                  icon="uil:save"
                  width={{ base: '100%', lg: 'auto' }}
                  onClick={() => {
                    changeBgTemp(customBgTemp)
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

export default BgTempSelector
