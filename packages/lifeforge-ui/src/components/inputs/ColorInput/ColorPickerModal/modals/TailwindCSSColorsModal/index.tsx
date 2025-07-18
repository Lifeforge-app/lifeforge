import { ModalHeader } from '@components/modals'
import colors from 'tailwindcss/colors'

import ColorItem from './components/ColorItem'

function TailwindCSSColorsModal({
  data: { color, setColor },
  onClose
}: {
  data: {
    color: string
    setColor: React.Dispatch<React.SetStateAction<string>>
  }
  onClose: () => void
}) {
  return (
    <div className="min-w-[70vw]">
      <ModalHeader
        icon="tabler:brand-tailwind"
        title="colorPicker.modals.morandiColorPalette"
        onClose={onClose}
      />
      <div className="space-y-3">
        {([...Object.keys(colors)] as Array<keyof typeof colors>)
          .filter(
            colorGroup =>
              typeof colors[colorGroup] === 'object' &&
              ![
                'warmGray',
                'coolGray',
                'blueGray',
                'trueGray',
                'lightBlue'
              ].includes(colorGroup)
          )
          .map((colorGroup, index) => (
            <div key={colorGroup} className="flex flex-col sm:flex-row">
              <h2 className="my-4 w-28 text-left text-xl font-medium sm:mb-2 sm:text-base">
                {colorGroup[0].toUpperCase() + colorGroup.slice(1)}
              </h2>
              <ul
                key={index}
                className="grid w-full grid-cols-[repeat(auto-fit,minmax(4rem,1fr))] flex-wrap gap-3 pt-0"
              >
                {Object.entries(
                  colors[colorGroup] as Record<string, string>
                ).map(([colorName, colorValue]) => (
                  <ColorItem
                    key={colorName}
                    name={colorName}
                    selected={color}
                    value={colorValue}
                    onSelect={color => {
                      setColor(color)
                      onClose()
                    }}
                  />
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  )
}

export default TailwindCSSColorsModal
