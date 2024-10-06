import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@components/ButtonsAndInputs/Button'
import ColorInput from '@components/ButtonsAndInputs/ColorPicker/ColorInput'
import ColorPickerModal from '@components/ButtonsAndInputs/ColorPicker/ColorPickerModal'
import ConfigColumn from '@components/Miscellaneous/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import DefaultBgTempSelector from './components/DefaultBgTempSelector'

function BgTempSelector(): React.ReactElement {
  const { bgTemp, setBgTemp } = usePersonalizationContext()
  const [customBgTemp, setCustomBgTemp] = useState<string>(
    bgTemp.startsWith('#') ? bgTemp : '#000000'
  )
  const [colorPickerModalOpen, setColorPickerModalOpen] =
    useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <ConfigColumn
      title={t('personalization.bgTempSelector.title')}
      desc={t('personalization.bgTempSelector.desc')}
      icon="tabler:temperature"
      noDefaultBreakpoints
      className="[@media(min-width:1170px)]:flex-row"
    >
      <div className="flex w-full min-w-0 flex-col items-center gap-4 lg:flex-row">
        <DefaultBgTempSelector bgTemp={bgTemp} setBgTemp={setBgTemp} />
        <button
          className={`ml-4 flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full border-2 border-bg-500 ring-offset-2 ring-offset-bg-50 transition-all dark:ring-offset-bg-950 lg:w-12 ${
            bgTemp.startsWith('#')
              ? 'ring-2 ring-bg-500'
              : 'hover:ring-2 hover:ring-bg-500'
          }`}
          onClick={() => {
            setBgTemp(customBgTemp)
          }}
        >
          <Icon icon="tabler:palette" className="size-6 text-bg-500" />
          <span className="font-medium text-bg-500 md:hidden">
            {t('personalization.bgTempSelector.customBgTemp')}
          </span>
        </button>
        {bgTemp.startsWith('#') && (
          <>
            <ColorInput
              className="w-full lg:w-min"
              name="Color Hex"
              color={customBgTemp}
              updateColor={setCustomBgTemp}
              setColorPickerOpen={setColorPickerModalOpen}
              hasTopMargin={false}
            />
            {bgTemp !== customBgTemp &&
              customBgTemp.match(/^#[0-9A-F]{6}$/i) !== null && (
                <Button
                  className="w-full lg:w-auto"
                  icon="uil:save"
                  onClick={() => {
                    setBgTemp(customBgTemp)
                  }}
                >
                  <span className="inline lg:hidden">{t('button.save')}</span>
                </Button>
              )}
            <ColorPickerModal
              color={customBgTemp}
              setColor={setCustomBgTemp}
              isOpen={colorPickerModalOpen}
              setOpen={setColorPickerModalOpen}
            />
          </>
        )}
      </div>
    </ConfigColumn>
  )
}

export default BgTempSelector
