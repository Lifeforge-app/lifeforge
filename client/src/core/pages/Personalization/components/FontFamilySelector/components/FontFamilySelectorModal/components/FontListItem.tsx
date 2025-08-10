import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import { useEffect } from 'react'

import type { FontFamily } from '..'
import {
  addFontToStylesheet,
  removeFontFromStylesheet
} from '../../../utils/fontFamily'

function FontListItem({
  font,
  selectedFont,
  setSelectedFont
}: {
  font: FontFamily
  selectedFont: string | null
  setSelectedFont: (font: string) => void
}) {
  useEffect(() => {
    addFontToStylesheet(font)

    return () => {
      removeFontFromStylesheet(font.family)
    }
  }, [font])

  return (
    <button
      className={clsx(
        'component-bg-lighter-with-hover relative w-full rounded-lg p-6 pr-0 text-left',
        selectedFont === font.family && 'border-custom-500 border-2'
      )}
      onClick={() => setSelectedFont(font.family)}
    >
      <div className="flex items-center gap-2 text-lg font-medium">
        <span>{font.family}</span>
        <span className="text-bg-500 text-base">
          ({font.variants.length} variants)
        </span>
      </div>
      {selectedFont === font.family && (
        <Icon
          className="text-custom-500 absolute top-2 right-1.5 size-6"
          icon="tabler:circle-check-filled"
        />
      )}
      <p
        className="relative mt-4 overflow-hidden text-4xl whitespace-nowrap"
        style={{
          fontFamily: font.family
        }}
      >
        The quick brown fox jumps over the lazy dog
      </p>
    </button>
  )
}

export default FontListItem
