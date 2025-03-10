import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import { ColorInput, ColorPickerModal } from '@components/inputs'
import ConfigColumn from '@components/utilities/ConfigColumn'
import { usePersonalizationContext } from '@providers/PersonalizationProvider'
import DefaultBgTempSelector from './components/DefaultBgTempSelector'

function BgTempSelector(): React.ReactElement {
  const { bgTemp, setBgTemp } = usePersonalizationContext()
  const [customBgTemp, setCustomBgTemp] = useState<string>(
    bgTemp.startsWith('#') ? bgTemp : '#000000'
  )
  const [colorPickerModalOpen, setColorPickerModalOpen] =
    useState<boolean>(false)
  const { t } = useTranslation(['modules.personalization', 'common.buttons'])

  return (
    <ConfigColumn
      noDefaultBreakpoints
      className="[@media(min-width:1170px)]:flex-row"
      desc={t('bgTempSelector.desc')}
      icon="tabler:temperature"
      title={t('bgTempSelector.title')}
    >
      <div className="flex w-full min-w-0 flex-col items-center gap-4 lg:flex-row">
        <DefaultBgTempSelector bgTemp={bgTemp} setBgTemp={setBgTemp} />
        <button
          className={clsx(
            'border-bg-500 ring-offset-bg-50 dark:ring-offset-bg-950 ml-4 flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-full border-2 ring-offset-2 transition-all lg:w-12',
            bgTemp.startsWith('#')
              ? 'ring-bg-500 ring-2'
              : 'hover:ring-bg-500 hover:ring-2'
          )}
          onClick={() => {
            setBgTemp(customBgTemp)
          }}
        >
          <Icon className="text-bg-500 size-6" icon="tabler:palette" />
          <span className="text-bg-500 font-medium md:hidden">
            {t('bgTempSelector.customBgTemp')}
          </span>
        </button>
        {bgTemp.startsWith('#') && (
          <>
            <ColorInput
              className="w-full lg:w-min"
              color={customBgTemp}
              hasTopMargin={false}
              name="Color Hex"
              namespace="modules.personalization"
              setColor={setCustomBgTemp}
              setColorPickerOpen={setColorPickerModalOpen}
            />
            {bgTemp !== customBgTemp &&
              customBgTemp.match(/^#[0-9A-F]{6}$/i) !== null && (
                <>
                  <Button
                    className="hidden w-full lg:flex"
                    icon="uil:save"
                    onClick={() => {
                      setBgTemp(customBgTemp)
                    }}
                  ></Button>
                  <Button
                    className="w-full lg:hidden"
                    icon="uil:save"
                    onClick={() => {
                      setBgTemp(customBgTemp)
                    }}
                  >
                    save
                  </Button>
                </>
              )}
            <ColorPickerModal
              color={customBgTemp}
              isOpen={colorPickerModalOpen}
              setColor={setCustomBgTemp}
              setOpen={setColorPickerModalOpen}
            />
          </>
        )}
      </div>
    </ConfigColumn>
  )
}

export default BgTempSelector
