import React from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import { SPICINESS_COLOR } from '@constants/todo_subtasks_generation_spiciness'
import SpicinessHeader from './components/SpicinessHeader'
import SpicinessSlider from './components/SpicinessSlider'

function SpicinessSelector({
  spiciness,
  setSpiciness
}: {
  spiciness: number
  setSpiciness: (spiciness: number) => void
}): React.ReactElement {
  return (
    <HamburgerMenu
      customIcon="icon-park-outline:chili"
      customTailwindColor={`${SPICINESS_COLOR[spiciness][0]} hover:bg-bg-100 dark:hover:bg-bg-700/30`}
      className="relative z-[9999]"
      customWidth="w-64"
    >
      <div className="space-y-2 p-4">
        <SpicinessHeader spiciness={spiciness} />
        <SpicinessSlider spiciness={spiciness} setSpiciness={setSpiciness} />
      </div>
    </HamburgerMenu>
  )
}

export default SpicinessSelector
