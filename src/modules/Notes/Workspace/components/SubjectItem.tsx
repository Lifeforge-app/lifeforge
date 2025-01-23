import { Icon } from '@iconify/react'
import React from 'react'
import { Link, useParams } from 'react-router-dom'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
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
      className={`group relative flex size-full flex-col items-center rounded-lg p-8 shadow-custom transition-all ${componentBgWithHover}`}
    >
      <Icon
        icon={subject.icon}
        className="pointer-events-none z-10 size-20 shrink-0 transition-all group-hover:text-custom-500"
      />
      <h2 className="mt-6 text-center text-2xl font-medium uppercase tracking-widest">
        {subject.title}
      </h2>
      <p className="mt-2 text-center text-sm text-bg-500">
        {subject.description}
      </p>
      <Link
        to={`/notes/${workspace}/${subject.id}`}
        className="absolute left-0 top-0 size-full"
      />
      <HamburgerMenu className="absolute right-4 top-4 z-20">
        <MenuItem
          onClick={() => {
            setExistedData(subject)
            setModifySubjectModalOpenType('update')
          }}
          icon="tabler:pencil"
          text="Edit"
        />
        <MenuItem
          onClick={() => {
            setExistedData(subject)
            setDeleteSubjectConfirmationModalOpen(true)
          }}
          icon="tabler:trash"
          text="Delete"
          isRed
        />
      </HamburgerMenu>
    </div>
  )
}

export default SubjectItem
