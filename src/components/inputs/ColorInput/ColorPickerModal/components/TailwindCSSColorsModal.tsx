import { Icon } from '@iconify/react'
import React from 'react'
import colors from 'tailwindcss/colors'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { isLightColor } from '@utils/colors'

function TailwindCSSColorsModal({
  isOpen,
  onClose,
  color,
  setColor
}: {
  isOpen: boolean
  onClose: () => void
  color: string
  setColor: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  return (
    <ModalWrapper isOpen={isOpen} minWidth="70vw">
      <ModalHeader
        icon="tabler:brand-tailwind"
        title="Tailwind CSS Color Palette"
        onClose={onClose}
      />
      <div className="space-y-3 overflow-y-auto">
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
                  <li key={colorValue} className="w-full">
                    <button
                      className={`flex-center aspect-square w-full cursor-pointer rounded-md shadow-custom ${
                        color === colorValue
                          ? 'ring-2 ring-bg-900 ring-offset-2 ring-offset-bg-100 dark:ring-bg-50 dark:ring-offset-bg-900'
                          : ''
                      }`}
                      style={{ backgroundColor: colorValue }}
                      onClick={() => {
                        setColor(colorValue)
                        onClose()
                      }}
                    >
                      {color === colorValue && (
                        <Icon
                          icon="tabler:check"
                          className={`${
                            isLightColor(colorValue)
                              ? 'text-bg-800'
                              : 'text-bg-50'
                          } size-8`}
                        />
                      )}
                    </button>
                    <p className="mt-2 text-xs font-medium">{colorName}</p>
                    <code className="block text-xs font-medium text-bg-500">
                      {colorValue}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </ModalWrapper>
  )
}

export default TailwindCSSColorsModal
