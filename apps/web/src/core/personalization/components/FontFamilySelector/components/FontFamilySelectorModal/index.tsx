import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  ModalHeader,
  Stack,
  WithTab,
  toast,
  usePersonalization
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

import CustomFontSelector from './tabs/custom'
import GoogleFontSelector from './tabs/google'

function FontFamilySelectorModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.personalization')
  const { fontFamily } = usePersonalization()
  const { changeFontFamily } = useUserPersonalization()
  const [selectedFont, setSelectedFont] = useState<string | null>(fontFamily)

  return (
    <Stack gap="md" height="100%" minHeight="80vh" minWidth="60vw">
      <ModalHeader
        icon="tabler:text-size"
        namespace="common.personalization"
        title="fontFamily.modals.fontFamilySelector"
        onClose={onClose}
      />
      <WithTab
        defaultValue={fontFamily.startsWith('custom:') ? 'custom' : 'google'}
        tabs={
          [
            {
              id: 'google',
              name: t('fontFamily.tabs.googleFonts'),
              icon: 'tabler:brand-google'
            },
            {
              id: 'custom',
              name: t('fontFamily.tabs.customFonts'),
              icon: 'tabler:upload'
            }
          ] as const
        }
        useNuqs={false}
      >
        {({ TabSelector, Tab }) => (
          <>
            <TabSelector />
            <Stack flex="1" width="100%">
              <Tab tabId="google">
                <GoogleFontSelector
                  selectedFont={selectedFont}
                  setSelectedFont={setSelectedFont}
                />
              </Tab>

              <Tab tabId="custom">
                <CustomFontSelector
                  selectedFont={selectedFont}
                  setSelectedFont={setSelectedFont}
                />
              </Tab>
            </Stack>
          </>
        )}
      </WithTab>
      {selectedFont && selectedFont !== fontFamily && (
        <Button
          icon="tabler:check"
          mt="lg"
          onClick={() => {
            changeFontFamily(selectedFont)
            onClose()
            toast.success('Font family changed successfully!')
          }}
        >
          Select
        </Button>
      )}
    </Stack>
  )
}

export default FontFamilySelectorModal
