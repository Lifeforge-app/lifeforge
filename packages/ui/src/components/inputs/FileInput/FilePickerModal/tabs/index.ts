import { type FilePickerSourceConfig, createTabbedView } from '@/components'

import { AIImageGenerator } from './AIImageGenerator'
import { ImageURL } from './ImageURL'
import { LocalUpload } from './LocalUpload'
import { Pixabay } from './Pixabay'

export const FILE_PICKET_TABS = {
  local: { icon: 'tabler:upload', Component: LocalUpload },
  url: { icon: 'tabler:link', Component: ImageURL },
  pixabay: { icon: 'simple-icons:pixabay', Component: Pixabay },
  ai: { icon: 'tabler:robot', Component: AIImageGenerator }
} as const

export function useTabbedView(sources: FilePickerSourceConfig) {
  return createTabbedView({
    namespace: 'common.modals',
    tabs: Object.entries(FILE_PICKET_TABS).map(([id, { icon }]) => ({
      id,
      icon,
      name: `common.modals:imagePicker.${id}`
    })),
    enabled: Object.keys(FILE_PICKET_TABS).filter(
      name => name === 'local' || sources[name as keyof FilePickerSourceConfig]
    )
  })
}
