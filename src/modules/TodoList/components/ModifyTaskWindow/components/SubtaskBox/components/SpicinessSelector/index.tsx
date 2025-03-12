import { HamburgerMenu } from '@lifeforge/ui'

import SpicinessHeader from './components/SpicinessHeader'
import SpicinessSlider from './components/SpicinessSlider'

function SpicinessSelector({
  spiciness,
  setSpiciness
}: {
  spiciness: number
  setSpiciness: (spiciness: number) => void
}) {
  return (
    <HamburgerMenu
      classNames={{
        wrapper: 'z-9999 relative',
        menu: 'bg-custom-500/20'
      }}
      customIcon="icon-park-outline:chili"
    >
      <div className="space-y-2 p-4">
        <SpicinessHeader spiciness={spiciness} />
        <SpicinessSlider setSpiciness={setSpiciness} spiciness={spiciness} />
      </div>
    </HamburgerMenu>
  )
}

export default SpicinessSelector
