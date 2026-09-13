import type { InferOutput } from '@lifeforge/api'
import { Flex, ModalHeader, createTabbedView } from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import TGVMovieList from './components/TGVMovieList'

export type TGVNowShowing = InferOutput<typeof forgeAPI.tgv.list>

export const TGVTabbedView = createTabbedView({
  tabs: [
    {
      id: 'nowShowing',
      name: 'tabs.nowShowing',
      icon: 'tabler:ticket'
    },
    {
      id: 'comingSoon',
      name: 'tabs.comingSoon',
      icon: 'tabler:calendar'
    }
  ]
})

function TGVListModal({ onClose }: { onClose: () => void }) {
  return (
    <Flex direction="column" minHeight="70vh" minWidth="70vw">
      <ModalHeader icon="tabler:ticket" title="Browse TGV" onClose={onClose} />
      <TGVTabbedView.Root>
        <TGVTabbedView.Selector />
        <TGVMovieList />
      </TGVTabbedView.Root>
    </Flex>
  )
}

export default TGVListModal
