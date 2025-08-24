import { Button, ModuleHeader, useModalStore } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import JournalList from './JournalList'
import ModifyEntryModal from './ModifyEntryModal'

function ContentContainer({ masterPassword }: { masterPassword: string }) {
  const { t } = useTranslation('apps.journal')

  const open = useModalStore(state => state.open)

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden lg:flex"
            icon="tabler:plus"
            tProps={{
              item: t('items.entry')
            }}
            onClick={() => {
              open(ModifyEntryModal, {
                openType: 'create',
                masterPassword
              })
            }}
          >
            new
          </Button>
        }
        icon="tabler:book"
        title="Journal"
      />
      <JournalList masterPassword={masterPassword} />
    </>
  )
}

export default ContentContainer
