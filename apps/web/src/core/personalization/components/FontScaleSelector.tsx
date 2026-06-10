import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Box,
  Button,
  Flex,
  OptionsColumn,
  SliderInput,
  usePersonalization
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

function FontScaleSelector() {
  const { fontScale } = usePersonalization()
  const { changeFontScale } = useUserPersonalization()
  const { t } = useTranslation('common.personalization')
  const [selectedFontScale, setSelectedFontScale] = useState(fontScale)

  return (
    <OptionsColumn
      description={t('fontScaleSelector.desc')}
      icon="tabler:text-size"
      title={t('fontScaleSelector.title')}
    >
      <Flex
        align="center"
        direction={{ base: 'column', md: 'row' }}
        gap="lg"
        mt={{ base: 'md', md: 'none' }}
        width="100%"
      >
        <Box minWidth={{ md: '16em' }} width="100%">
          <SliderInput
            max={2}
            min={0.5}
            namespace="common.personalization"
            step={0.1}
            value={selectedFontScale}
            onChange={value => {
              setSelectedFontScale(value)
            }}
          />
        </Box>
        <Button
          disabled={selectedFontScale === fontScale}
          icon="tabler:check"
          width={{ base: '100%', md: 'auto' }}
          onClick={() => {
            changeFontScale(selectedFontScale)
          }}
        >
          save
        </Button>
      </Flex>
    </OptionsColumn>
  )
}

export default FontScaleSelector
