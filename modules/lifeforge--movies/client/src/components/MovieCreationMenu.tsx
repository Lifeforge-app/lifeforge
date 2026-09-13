import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  FAB,
  useModalStore
} from '@lifeforge/ui'

import SearchTMDBModal from './modals/SearchTMDBModal'
import TGVListModal from './modals/TGVListModal'

function MovieCreationMenu({ variant }: { variant: 'desktop' | 'mobile' }) {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  const items = (
    <>
      <ContextMenuItem
        icon="selfhst:tmdb"
        label="fromTmdb"
        onClick={() => open(SearchTMDBModal, {})}
      />
      <ContextMenuItem
        icon="tabler:ticket"
        label="fromTgv"
        onClick={() => open(TGVListModal, {})}
      />
    </>
  )

  if (variant === 'desktop') {
    return (
      <ContextMenu
        buttonComponent={
          <Button
            display={{ base: 'none', md: 'flex' }}
            icon="tabler:plus"
            tProps={{ item: t('items.movie') }}
          >
            new
          </Button>
        }
      >
        {items}
      </ContextMenu>
    )
  }

  return (
    <ContextMenu
      bottom="1.5rem"
      buttonComponent={<FAB position="static" visibilityBreakpoint="md" />}
      componentProps={{
        menu: { minWidth: '18em' },
        button: { position: 'static' }
      }}
      position="fixed"
      right="1.5rem"
      width="min-content"
      zIndex="10"
    >
      {items}
    </ContextMenu>
  )
}

export default MovieCreationMenu
