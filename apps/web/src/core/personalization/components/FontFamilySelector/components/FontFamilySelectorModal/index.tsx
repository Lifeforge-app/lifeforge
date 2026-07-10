import { useState } from 'react'

import {
  Button,
  ModalHeader,
  Stack,
  toast,
  usePersonalization
} from '@lifeforge/ui'

import { useUserPersonalization } from '@/providers/features/UserPersonalizationProvider'

import { FontFamilySelectorContext } from './contexts/FontFamilySelectorContext'
import { FONT_PICKER_TABS, useTabbedView } from './tabs'

function FontFamilySelectorModal({ onClose }: { onClose: () => void }) {
  const { fontFamily } = usePersonalization()
  const { changeFontFamily } = useUserPersonalization()
  const [selectedFont, setSelectedFont] = useState<string | null>(fontFamily)
  const TabbedView = useTabbedView()

  return (
    <FontFamilySelectorContext.Provider
      value={{ selectedFont, setSelectedFont }}
    >
      <Stack gap="md" height="100%" minHeight="80vh" minWidth="60vw">
        <ModalHeader
          icon="tabler:text-size"
          namespace="common.personalization"
          title="fontFamily.modals.fontFamilySelector"
          onClose={onClose}
        />
        <TabbedView.Root>
          <TabbedView.Selector />
          <Stack flex="1" width="100%">
            {Object.entries(FONT_PICKER_TABS).map(([tabId, { Component }]) => (
              <TabbedView.When
                key={tabId}
                tabId={tabId as keyof typeof FONT_PICKER_TABS}
              >
                <Component />
              </TabbedView.When>
            ))}
          </Stack>
        </TabbedView.Root>
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
    </FontFamilySelectorContext.Provider>
  )
}

export default FontFamilySelectorModal
