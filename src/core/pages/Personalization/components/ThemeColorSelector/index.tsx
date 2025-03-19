import { usePersonalization } from '@providers/PersonalizationProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  ColorInput,
  ColorPickerModal,
  ConfigColumn
} from '@lifeforge/ui'

import DefaultThemeColorSelector from './components/DefaultThemeColorSelector'

function ThemeColorSelector() {
  const { rawThemeColor: themeColor, setThemeColor } = usePersonalization()
  const [customThemeColor, setCustomThemeColor] = useState<string>(
    themeColor.startsWith('#') ? themeColor : '#000000'
  )
  const [colorPickerModalOpen, setColorPickerModalOpen] =
    useState<boolean>(false)
  const { t } = useTranslation('core.personalization')

  return (
    <ConfigColumn
      desc={t('themeColorSelector.desc')}
      icon="tabler:palette"
      title={t('themeColorSelector.title')}
      wrapWhen="lg"
    >
      <div className="flex w-full flex-col items-center gap-4 md:flex-row">
        <DefaultThemeColorSelector
          customThemeColor={customThemeColor}
          setThemeColor={setThemeColor}
          themeColor={themeColor}
        />
        {themeColor.startsWith('#') && (
          <>
            <ColorInput
              className="md:w-min"
              color={customThemeColor}
              hasTopMargin={false}
              name="Color Hex"
              namespace="core.personalization"
              setColor={setCustomThemeColor}
              setColorPickerOpen={setColorPickerModalOpen}
            />
            {themeColor !== customThemeColor &&
              customThemeColor.match(/^#[0-9A-F]{6}$/i) !== null && (
                <Button
                  className="w-full lg:w-auto"
                  icon="uil:save"
                  onClick={() => {
                    setThemeColor(customThemeColor)
                  }}
                >
                  <span className="inline lg:hidden">{t('buttons.save')}</span>
                </Button>
              )}
            <ColorPickerModal
              color={customThemeColor}
              isOpen={colorPickerModalOpen}
              setColor={setCustomThemeColor}
              setOpen={setColorPickerModalOpen}
            />
          </>
        )}
      </div>
    </ConfigColumn>
  )
}

export default ThemeColorSelector
