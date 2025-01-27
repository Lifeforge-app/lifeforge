import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import { ColorInput , ColorPickerModal } from '@components/inputs'
import ConfigColumn from '@components/utilities/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import DefaultThemeColorSelector from './components/DefaultThemeColorSelector'

function ThemeColorSelector(): React.ReactElement {
  const { themeColor, setThemeColor } = usePersonalizationContext()
  const [customThemeColor, setCustomThemeColor] = useState<string>(
    themeColor.startsWith('#') ? themeColor : '#000000'
  )
  const [colorPickerModalOpen, setColorPickerModalOpen] =
    useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <ConfigColumn
      title={t('personalization.themeColorSelector.title')}
      desc={t('personalization.themeColorSelector.desc')}
      icon="tabler:palette"
      wrapWhen="lg"
    >
      <div className="flex w-full flex-col items-center gap-4 md:flex-row">
        <DefaultThemeColorSelector
          themeColor={themeColor}
          setThemeColor={setThemeColor}
          customThemeColor={customThemeColor}
        />
        {themeColor.startsWith('#') && (
          <>
            <ColorInput
              className="md:w-min"
              name="Color Hex"
              color={customThemeColor}
              updateColor={setCustomThemeColor}
              setColorPickerOpen={setColorPickerModalOpen}
              hasTopMargin={false}
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
                  <span className="inline lg:hidden">{t('button.save')}</span>
                </Button>
              )}
            <ColorPickerModal
              color={customThemeColor}
              setColor={setCustomThemeColor}
              isOpen={colorPickerModalOpen}
              setOpen={setColorPickerModalOpen}
            />
          </>
        )}
      </div>
    </ConfigColumn>
  )
}

export default ThemeColorSelector
