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
    >
      <DefaultBgTempSelector bgTemp={bgTemp} setBgTemp={setBgTemp} />
      <button
        className={`ml-4 flex size-12 items-center justify-center rounded-full border-2 border-bg-500 ring-offset-2 ring-offset-bg-50 transition-all dark:ring-offset-bg-950 ${
          bgTemp.startsWith('#')
            ? 'ring-2 ring-bg-500'
            : 'hover:ring-2 hover:ring-bg-500'
        }`}
        onClick={() => {
          setBgTemp(customBgTemp)
        }}
      >
        {bgTemp === 'custom' ? (
          <Icon
            icon="tabler:check"
            className="size-4 text-bg-50 dark:text-bg-800"
          />
        ) : (
          <Icon icon="tabler:palette" className="size-6 text-bg-500" />
        )}
      </button>
      {bgTemp.startsWith('#') && (
        <>
          <ColorInput
            className="w-min"
            name="Color Hex"
            color={customBgTemp}
            updateColor={setBgTemp}
            setColorPickerOpen={setColorPickerModalOpen}
            hasTopMargin={false}
          />
          {bgTemp !== customBgTemp &&
            customBgTemp.match(/^#[0-9A-F]{6}$/i) !== null && (
              <Button
                icon="uil:save"
                onClick={() => {
                  setBgTemp(customBgTemp)
                }}
              />
            )}
          <ColorPickerModal
            color={customBgTemp}
            setColor={setCustomBgTemp}
            isOpen={colorPickerModalOpen}
            setOpen={setColorPickerModalOpen}
          />
        </>
      )}
    </ConfigColumn>
  )
}

export default BgTempSelector
