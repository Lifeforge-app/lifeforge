import { Icon } from '@iconify/react'
import { Button } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import { IdeaBoxCollectionsSchemas } from 'shared/types/collections'

import TypeSelector from './components/TypeSelector'

function ModalHeader({
  innerOpenType,
  innerTypeOfModifyIdea,
  setInnerTypeOfModifyIdea,
  onClose
}: {
  innerOpenType: 'create' | 'update' | 'paste' | null
  innerTypeOfModifyIdea: IdeaBoxCollectionsSchemas.IEntry['type']
  setInnerTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<IdeaBoxCollectionsSchemas.IEntry['type']>
  >
  onClose: () => void
}) {
  const { t } = useTranslation('apps.ideaBox')

  return (
    <>
      <div className="flex-between flex w-full gap-3 sm:mb-6">
        <h1 className="flex w-full min-w-0 items-center gap-3 text-2xl font-semibold">
          <Icon
            key={innerOpenType}
            className="size-7"
            icon={
              {
                create: 'tabler:plus',
                update: 'tabler:pencil',
                paste: 'tabler:plus'
              }[innerOpenType!]
            }
          />
          <span className="w-full min-w-0 items-center gap-3 truncate sm:flex">
            {t(
              `modals.idea.${innerOpenType === 'update' ? 'update' : 'create'}`
            )}{' '}
            {innerOpenType === 'update' ? (
              t(`entryType.${innerTypeOfModifyIdea}`) + ' '
            ) : (
              <TypeSelector
                inline
                innerTypeOfModifyIdea={innerTypeOfModifyIdea}
                setInnerTypeOfModifyIdea={setInnerTypeOfModifyIdea}
              />
            )}
            {t('items.idea')}
          </span>
        </h1>
        <Button
          icon="tabler:x"
          iconClassName="size-6"
          variant="plain"
          onClick={onClose}
        />
      </div>
      <TypeSelector
        innerTypeOfModifyIdea={innerTypeOfModifyIdea}
        setInnerTypeOfModifyIdea={setInnerTypeOfModifyIdea}
      />
    </>
  )
}

export default ModalHeader
