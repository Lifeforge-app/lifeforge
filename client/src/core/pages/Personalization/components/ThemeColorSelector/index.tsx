import { useUserPersonalization } from '@providers/UserPersonalizationProvider'
import { Button, ColorInput, ConfigColumn } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { usePersonalization } from 'shared/lib'

import DefaultThemeColorSelector from './components/DefaultThemeColorSelector'

function ThemeColorSelector() {
  const { rawThemeColor: themeColor } = usePersonalization()
  const { changeThemeColor } = useUserPersonalization()
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
                    changeThemeColor(customThemeColor)
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
