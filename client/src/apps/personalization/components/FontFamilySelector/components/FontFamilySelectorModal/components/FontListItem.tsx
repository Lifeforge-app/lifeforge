import { Icon } from '@iconify/react'
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
        'component-bg-lighter-with-hover relative w-full min-w-0 rounded-lg p-6 pr-0 text-left',
        selectedFont === font.family && 'border-custom-500 border-2'
      )}
      onClick={() => setSelectedFont(font.family)}
    >
      <div className="flex w-full min-w-0 flex-col pr-6 text-lg font-medium md:flex-row md:items-center md:gap-2">
        <span className="min-w-0 truncate">{font.family}</span>
        <span className="text-bg-500 hidden text-base whitespace-nowrap md:block">
          ({font.variants.length} variants)
        </span>
        <span className="text-bg-500 block text-base whitespace-nowrap md:hidden">
          {font.variants.length} variants
        </span>
      </div>
      {selectedFont === font.family && (
        <Icon
          className="text-custom-500 absolute top-2 right-1.5 size-6"
          icon="tabler:circle-check-filled"
        />
      )}
      <p
        className="relative mt-4 overflow-hidden py-4 text-4xl whitespace-nowrap"
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
