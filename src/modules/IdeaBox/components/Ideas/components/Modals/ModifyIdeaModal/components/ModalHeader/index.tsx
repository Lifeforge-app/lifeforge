import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import TypeSelector from './components/TypeSelector'

function ModalHeader({
  innerOpenType,
  setOpenType,
  innerTypeOfModifyIdea,
  setInnerTypeOfModifyIdea
}: {
  innerOpenType: 'create' | 'update' | 'paste' | null
  setOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | 'paste' | null>
  >
  innerTypeOfModifyIdea: 'text' | 'image' | 'link'
  setInnerTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'text' | 'image' | 'link'>
  >
}): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')

  return (
    <>
      <div className="flex-between flex w-full gap-4 sm:mb-6">
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
          variant="no-bg"
          onClick={() => {
            setOpenType(null)
          }}
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
