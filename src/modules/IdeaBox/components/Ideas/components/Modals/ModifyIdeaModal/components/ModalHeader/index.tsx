import { Icon } from '@iconify/react'
import React from 'react'
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
  return (
    <>
      <div className="flex-between flex w-full gap-4 sm:mb-6">
        <h1 className="flex w-full min-w-0 items-center gap-3 text-2xl font-semibold">
          <Icon
            key={innerOpenType}
            icon={
              {
                create: 'tabler:plus',
                update: 'tabler:pencil',
                paste: 'tabler:plus'
              }[innerOpenType!]
            }
            className="size-7"
          />
          <span className="w-full min-w-0 items-center gap-3 truncate sm:flex">
            {
              {
                create: 'New ',
                update: 'Update ',
                paste: 'New '
              }[innerOpenType!]
            }{' '}
            {innerOpenType === 'update' ? (
              innerTypeOfModifyIdea[0].toUpperCase() +
              innerTypeOfModifyIdea.slice(1) +
              ' '
            ) : (
              <TypeSelector
                inline
                innerTypeOfModifyIdea={innerTypeOfModifyIdea}
                setInnerTypeOfModifyIdea={setInnerTypeOfModifyIdea}
              />
            )}
            Idea
          </span>
        </h1>
        <Button
          variant="no-bg"
          onClick={() => {
            setOpenType(null)
          }}
          iconClassName="size-6"
          icon="tabler:x"
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
