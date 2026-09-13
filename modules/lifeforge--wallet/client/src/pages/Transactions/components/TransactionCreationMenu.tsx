import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  ContextMenu,
  ContextMenuItem,
  FAB,
  useModalStore
} from '@lifeforge/ui'

import ManageTemplatesModal from '../modals/ManageTemplatesModal'
import ModifyTransactionsModal from '../modals/ModifyTransactionsModal'
import NaturalLanguageModal from '../modals/NaturalLanguageModal'
import ScanReceiptModal from '../modals/ScanReceiptModal'

function TransactionCreationMenu({
  variant
}: {
  variant: 'desktop' | 'mobile'
}) {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()
  const { hash } = useLocation()

  useEffect(() => {
    if (hash === '#new') {
      open(ModifyTransactionsModal, { type: 'create' })
    }

    if (hash === '#scan') {
      open(ScanReceiptModal, {})
    }

    if (hash === '#ai') {
      open(NaturalLanguageModal, {})
    }
  }, [hash])

  const items = (
    <>
      <ContextMenuItem
        icon="tabler:plus"
        label="Add Manually"
        onClick={() => open(ModifyTransactionsModal, { type: 'create' })}
      />
      <ContextMenuItem
        icon="tabler:template"
        label="From Template"
        onClick={() => open(ManageTemplatesModal, { choosing: true })}
      />
      <ContextMenuItem
        icon="tabler:scan"
        label="Scan Receipt"
        onClick={() => open(ScanReceiptModal, {})}
      />
      <ContextMenuItem
        icon="tabler:brain"
        label="fromNaturalLanguage"
        onClick={() => open(NaturalLanguageModal, {})}
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
            tProps={{ item: t('items.transaction') }}
            onClick={() => {}}
          >
            new
          </Button>
        }
        componentProps={{
          menu: {
            minWidth: '18em'
          }
        }}
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
        menu: {
          minWidth: '18em'
        },
        button: {
          position: 'static'
        }
      }}
      position="fixed"
      right="1.5rem"
      width="min-content"
    >
      {items}
    </ContextMenu>
  )
}

export default TransactionCreationMenu
