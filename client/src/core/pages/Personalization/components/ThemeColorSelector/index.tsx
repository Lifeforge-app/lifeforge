import { usePersonalization } from '@providers/PersonalizationProvider'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, ColorInput, ConfigColumn } from '@lifeforge/ui'

import DefaultThemeColorSelector from './components/DefaultThemeColorSelector'

function ThemeColorSelector() {
  const { rawThemeColor: themeColor, setThemeColor } = usePersonalization()
  const [customThemeColor, setCustomThemeColor] = useState<string>(
    themeColor.startsWith('#') ? themeColor : '#000000'
  )
  const { t } = useTranslation('core.personalization')

  return (
    <ConfigColumn
      desc={t('themeColorSelector.desc')}
      icon="tabler:palette"
      title={t('themeColorSelector.title')}
      wrapWhen="lg"
    >
      <div className="flex w-full flex-col items-center gap-3 md:flex-row">
        <DefaultThemeColorSelector
          customThemeColor={customThemeColor}
          setThemeColor={setThemeColor}
          themeColor={themeColor}
        />
        {themeColor.startsWith('#') && (
          <>
            <ColorInput
              className="w-full md:w-min"
              color={customThemeColor}
              name="Color Hex"
              namespace="core.personalization"
              setColor={setCustomThemeColor}
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
          </>
        )}
      </div>
    </ConfigColumn>
  )
}

export default ThemeColorSelector
