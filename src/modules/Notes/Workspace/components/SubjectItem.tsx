import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { Link, useParams } from 'react-router'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type INotesSubject } from '@interfaces/notes_interfaces'

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
        'group shadow-custom relative flex size-full flex-col items-center rounded-lg p-8 transition-all',
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
      <h2 className="mt-6 text-center text-2xl font-medium tracking-widest uppercase">
        {subject.title}
      </h2>
      <p className="text-bg-500 mt-2 text-center text-sm">
        {subject.description}
      </p>
      <Link
        className="absolute top-0 left-0 size-full"
        to={`/notes/${workspace}/${subject.id}`}
      />
      <HamburgerMenu className="absolute top-4 right-4 z-20">
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
