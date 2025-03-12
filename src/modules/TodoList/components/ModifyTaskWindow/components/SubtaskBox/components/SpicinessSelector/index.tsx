import React from 'react'

import { HamburgerMenu } from '@lifeforge/ui'

import { SPICINESS_COLOR } from '@modules/TodoList/constants/todo_subtasks_generation_spiciness'

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
      className="z-9999 relative"
      customIcon="icon-park-outline:chili"
      customTailwindColor={`${SPICINESS_COLOR[spiciness][0]} hover:bg-bg-100 dark:hover:bg-bg-700/30`}
      customWidth="w-64"
    >
      <div className="space-y-2 p-4">
        <SpicinessHeader spiciness={spiciness} />
        <SpicinessSlider setSpiciness={setSpiciness} spiciness={spiciness} />
      </div>
    </HamburgerMenu>
  )
}

export default SpicinessSelector
