import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  ModalHeader,
  Stack,
  Tabs,
  toast,
  usePersonalization
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

import CustomFontSelector from './tabs/custom'
import GoogleFontSelector from './tabs/google'

type TabType = 'google' | 'custom'

function FontFamilySelectorModal({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation('common.personalization')
  const { fontFamily } = usePersonalization()
  const { changeFontFamily } = useUserPersonalization()
  const [activeTab, setActiveTab] = useState<TabType>(
    fontFamily.startsWith('custom:') ? 'custom' : 'google'
  )
  const [selectedFont, setSelectedFont] = useState<string | null>(fontFamily)

  return (
    <Stack gap="md" height="100%" minHeight="80vh" minWidth="60vw">
      <ModalHeader
        icon="tabler:text-size"
        namespace="common.personalization"
        title="fontFamily.modals.fontFamilySelector"
        onClose={onClose}
      />
      <Tabs
        currentTab={activeTab}
        enabled={['google', 'custom'] as const}
        items={
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
        onTabChange={setActiveTab}
      />
      <Stack flex="1" width="100%">
        {activeTab === 'google' ? (
          <GoogleFontSelector
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
          />
        ) : (
          <CustomFontSelector
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
          />
        )}
      </Stack>
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
