import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'
import { Button, ModalHeader, Tabs } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { usePersonalization } from 'shared'

import CustomFontSelector from './tabs/CustomFontSelector'
import GoogleFontSelector from './tabs/GoogleFontSelector'

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
    <div className="flex h-full min-h-[80vh] min-w-[60vw] flex-col">
      <ModalHeader
        icon="tabler:text-size"
        namespace="common.personalization"
        title="fontFamily.modals.fontFamilySelector"
        onClose={onClose}
      />
      <Tabs
        className="mb-4"
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
      {selectedFont && selectedFont !== fontFamily && (
        <Button
          className="mt-6"
          icon="tabler:check"
          onClick={() => {
            changeFontFamily(selectedFont)
            onClose()
            toast.success('Font family changed successfully!')
          }}
        >
          Select
        </Button>
      )}
    </div>
  )
}

export default FontFamilySelectorModal
