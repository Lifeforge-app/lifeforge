import { createViewMode } from '@lifeforge/ui'

export const ViewModes = createViewMode({
  modes: [
    { icon: 'uil:apps', value: 'grid' },
    { icon: 'tabler:list', value: 'list' }
  ],
  selectorProps: { display: { base: 'none', md: 'flex' } }
})
