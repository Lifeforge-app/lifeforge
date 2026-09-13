import { useModuleTranslation } from '@lifeforge/localization'
import {
  Alert,
  Button,
  ModalHeader,
  Stack,
  WithQueryData,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import ModifyTemplatesModal from '../ModifyTemplatesModal'
import TemplateList from './components/TemplateList'
import { TemplatesTabbedView } from './constants/tabbed_view'

function ManageTemplatesModal({
  onClose,
  data: { choosing }
}: {
  onClose: () => void
  data: { choosing?: boolean }
}) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()

  return (
    <Stack minHeight="80vh" minWidth="40vw">
      <ModalHeader
        icon="tabler:template"
        title={`templates.${choosing ? 'choose' : 'manage'}`}
        trailing={
          !choosing ? (
            <Button
              icon="tabler:plus"
              variant="plain"
              onClick={() => open(ModifyTemplatesModal, { type: 'create' })}
            />
          ) : undefined
        }
        onClose={onClose}
      />
      {!choosing && (
        <Alert mb="md" type="note">
          {t('messages.aiAccuracy')}
        </Alert>
      )}
      <TemplatesTabbedView.Root>
        <TemplatesTabbedView.Selector />
        <WithQueryData contract={forgeAPI.templates.list}>
          {templates => (
            <TemplateList
              choosing={choosing}
              templates={templates}
              onClose={onClose}
            />
          )}
        </WithQueryData>
      </TemplatesTabbedView.Root>
    </Stack>
  )
}

export default ManageTemplatesModal
