import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  EmptyStateScreen,
  ModalHeader,
  QueryWrapper,
  Tabs,
  useModalStore
} from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import ModifyTemplatesModal from '../ModifyTemplatesModal'
import TemplateItem from './components/Templateitem'

function ManageTemplatesModal({
  onClose,
  data: { choosing }
}: {
  onClose: () => void
  data: { choosing?: boolean }
}) {
  const { t } = useTranslation('apps.wallet')

  const open = useModalStore(state => state.open)

  const [selectedTab, setSelectedTab] = useState<'income' | 'expenses'>(
    'income'
  )

  const transactionTemplatesQuery = useQuery(
    forgeAPI.wallet.templates.list.queryOptions()
  )

  return (
    <>
      <ModalHeader
        actionButtonIcon={!choosing ? 'tabler:plus' : undefined}
        className="min-w-[40vw]"
        icon="tabler:template"
        namespace="apps.wallet"
        title={`templates.${choosing ? 'choose' : 'manage'}`}
        onActionButtonClick={() => {
          open(ModifyTemplatesModal, {
            type: 'create'
          })
        }}
        onClose={onClose}
      />
      <Tabs
        active={selectedTab}
        enabled={['income', 'expenses']}
        items={[
          {
            name: t('transactionTypes.income'),
            id: 'income',
            icon: 'tabler:login-2',
            amount: transactionTemplatesQuery.data?.income?.length || 0
          },
          {
            name: t('transactionTypes.expenses'),
            id: 'expenses',
            icon: 'tabler:logout',
            amount: transactionTemplatesQuery.data?.expenses?.length || 0
          }
        ]}
        onNavClick={setSelectedTab}
      />
      <QueryWrapper query={transactionTemplatesQuery}>
        {templates =>
          Object.values(templates).flat().length > 0 ? (
            <ul className="mb-4 space-y-3">
              {templates[selectedTab].length > 0 ? (
                templates[selectedTab].map(template => (
                  <TemplateItem
                    key={template.id}
                    choosing={!!choosing}
                    template={template}
                    onClose={onClose}
                  />
                ))
              ) : (
                <EmptyStateScreen
                  smaller
                  CTAButtonProps={{
                    children: 'new',
                    icon: 'tabler:plus',
                    onClick: () => {
                      open(ModifyTemplatesModal, {
                        type: 'create'
                      })
                    },
                    tProps: { item: t('items.template') }
                  }}
                  icon="tabler:template-off"
                  name="templates"
                  namespace="apps.wallet"
                />
              )}
            </ul>
          ) : (
            <EmptyStateScreen
              CTAButtonProps={{
                children: 'new',
                icon: 'tabler:plus',
                onClick: () => {
                  open(ModifyTemplatesModal, {
                    type: 'create'
                  })
                },
                tProps: { item: t('items.template') }
              }}
              icon="tabler:template-off"
              name="templates"
              namespace="apps.wallet"
            />
          )
        }
      </QueryWrapper>
    </>
  )
}

export default ManageTemplatesModal
