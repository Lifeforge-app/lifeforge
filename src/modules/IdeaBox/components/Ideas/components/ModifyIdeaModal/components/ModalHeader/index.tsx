/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Icon } from '@iconify/react'
import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
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
      <div className="flex-between flex w-full gap-16 sm:mb-8">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
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
        </h1>
        <Button
          variant="no-bg"
          onClick={() => {
            setOpenType(null)
          }}
          iconSize="size-6"
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
