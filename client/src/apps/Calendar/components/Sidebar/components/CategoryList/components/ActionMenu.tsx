import { ContextMenuItem } from 'lifeforge-ui'

function ActionMenu({
  onEdit,
  onDelete
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <>
      <ContextMenuItem icon="tabler:pencil" label="Edit" onClick={onEdit} />
      <ContextMenuItem
        dangerous
        icon="tabler:trash"
        label="Delete"
        onClick={onDelete}
      />
    </>
  )
}

export default ActionMenu
