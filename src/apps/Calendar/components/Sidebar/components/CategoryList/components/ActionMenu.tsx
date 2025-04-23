import React from 'react'

import { MenuItem } from '@lifeforge/ui'

function ActionMenu({
  onEdit,
  onDelete
}: {
  onEdit: (e: React.MouseEvent) => void
  onDelete: (e: React.MouseEvent) => void
}) {
  return (
    <>
      <MenuItem icon="tabler:pencil" text="Edit" onClick={onEdit} />
      <MenuItem isRed icon="tabler:trash" text="Delete" onClick={onDelete} />
    </>
  )
}

export default ActionMenu
