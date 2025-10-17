import { Icon } from '@iconify/react'
import { Button, ColorInput, Switch } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { usePersonalization } from 'shared'

function CustomColorInput() {
  const [color, setColor] = useState('#a9d066')

  const { setRawThemeColor, rawThemeColor } = usePersonalization()

  useEffect(() => {
    setColor(rawThemeColor.toUpperCase())
  }, [rawThemeColor])

  return (
    <>
      <div className="mt-8 flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <Icon className="size-6" icon="tabler:palette" />
          <span className="text-lg">Use custom color</span>
        </div>
        <Switch
          checked={rawThemeColor.startsWith('#')}
          onChange={() => {
            if (rawThemeColor.startsWith('#')) {
              setRawThemeColor('theme-lime')
            } else {
              setRawThemeColor('#A9D066')
            }
          }}
        />
      </div>
      <ColorInput
        className="mt-4"
        disabled={!rawThemeColor.startsWith('#')}
        label="Custom Color"
        setValue={c => {
          setColor(c)
        }}
        value={color.startsWith('#') ? color : '#A9D066'}
      />
      <Button
        className="mt-4 w-full"
        disabled={!rawThemeColor.startsWith('#') || color === rawThemeColor}
        icon="tabler:check"
        onClick={() => {
          setRawThemeColor(color)
        }}
      >
        Apply
      </Button>
    </>
  )
}

export default CustomColorInput
