import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { Link, useParams } from 'react-router'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type INotesSubject } from '@interfaces/notes_interfaces'

import useThemeColors from '@hooks/useThemeColor'

function SubjectItem({
  subject,
  setModifySubjectModalOpenType,
  setExistedData,
  setDeleteSubjectConfirmationModalOpen
}: {
  subject: INotesSubject
  setModifySubjectModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: (data: any) => void
  setDeleteSubjectConfirmationModalOpen: (state: boolean) => void
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const { workspace } = useParams<{ workspace: string }>()

  return (
    <div
      className={clsx(
        'shadow-custom group relative flex size-full flex-col items-center rounded-lg p-8 transition-all',
        componentBgWithHover
      )}
    >
      <Icon
        className={clsx(
          'pointer-events-none z-10 size-20 shrink-0 transition-all',
          'group-hover:text-custom-500'
        )}
        icon={subject.icon}
      />
      <h2 className="mt-6 text-center text-2xl font-medium uppercase tracking-widest">
        {subject.title}
      </h2>
      <p className="text-bg-500 mt-2 text-center text-sm">
        {subject.description}
      </p>
      <Link
        className="absolute left-0 top-0 size-full"
        to={`/notes/${workspace}/${subject.id}`}
      />
      <HamburgerMenu className="absolute right-4 top-4 z-20">
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            setExistedData(subject)
            setModifySubjectModalOpenType('update')
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setExistedData(subject)
            setDeleteSubjectConfirmationModalOpen(true)
          }}
        />
      </HamburgerMenu>
    </div>
  )
}

export default SubjectItem
