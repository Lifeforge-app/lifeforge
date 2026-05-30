import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePersonalization } from '@lifeforge/shared'
import {
  Bordered,
  Box,
  Button,
  ColorInput,
  Flex,
  Icon,
  OptionsColumn,
  Ring,
  Text,
  Transition
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
      // className="[@media(min-width:1170px)]:flex-row"
      description={t('bgTempSelector.desc')}
      icon="tabler:temperature"
      title={t('bgTempSelector.title')}
    >
      <Flex align="center" direction={{ base: 'column', lg: 'row' }} gap="md">
        <DefaultBgTempSelector bgTemp={bgTemp} />
        <Transition>
          <Bordered asChild borderColor="bg-500" borderWidth="2px">
            <Ring
              asChild
              ringColor={
                bgTemp.startsWith('#')
                  ? 'bg-500'
                  : { base: 'transparent', hover: 'bg-500' }
              }
              ringOffsetWidth="2px"
              ringWidth="2px"
            >
              <Flex
                centered
                as="button"
                flexShrink="0"
                gap="sm"
                height="3em"
                ml="md"
                r="full"
                width={{ base: '100%', lg: '3em' }}
                onClick={() => {
                  changeBgTemp(customBgTemp)
                }}
              >
                <Icon color="muted" icon="tabler:palette" size="1.5em" />
                <Text
                  color="muted"
                  display={{ base: 'inline', md: 'none' }}
                  weight="medium"
                >
                  {t('bgTempSelector.customBgTemp')}
                </Text>
              </Flex>
            </Ring>
          </Bordered>
        </Transition>
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
                <>
                  <Button
                    className="hidden w-full lg:flex"
                    icon="uil:save"
                    onClick={() => {
                      changeBgTemp(customBgTemp)
                    }}
                  ></Button>
                  <Button
                    className="w-full lg:hidden"
                    icon="uil:save"
                    onClick={() => {
                      changeBgTemp(customBgTemp)
                    }}
                  >
                    save
                  </Button>
                </>
              )}
          </>
        )}
      </Flex>
    </OptionsColumn>
  )
}

export default BgTempSelector
