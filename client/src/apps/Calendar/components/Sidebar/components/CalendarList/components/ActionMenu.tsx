import { ContextMenuItem } from 'lifeforge-ui'
import React from 'react'

function ActionMenu({
  onEdit,
  onDelete
}: {
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}) {
  return (
    <>
      <ContextMenuItem icon="tabler:pencil" text="Edit" onClick={onEdit} />
      <ContextMenuItem
        isRed
        icon="tabler:trash"
        text="Delete"
        onClick={onDelete}
      />
    </>
  )
}

export default ActionMenu
