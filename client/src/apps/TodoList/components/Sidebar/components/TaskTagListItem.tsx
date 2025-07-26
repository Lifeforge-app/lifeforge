import ModifyTagModal from '@apps/TodoList/modals/ModifyTagModal'

function TaskTagListItem({
  item,
  setSidebarOpen
}: {
  item: ISchemaWithPB<TodoListCollectionsSchemas.ITagAggregated>
  setSidebarOpen: (value: boolean) => void
}) {
  const open = useModalStore(state => state.open)

  const [searchParams, setSearchParams] = useSearchParams()

  const handleUpdateTag = useCallback(() => {
    open(ModifyTagModal, {
      type: 'update',
      initialData: item
    })
  }, [item])

  const handleDeleteTag = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'todo-list/tags',
      confirmationText: 'Delete this tag',
      customText:
        'Are you sure you want to delete this tag? The tasks with this tag will not be deleted.',
      data: item,
      itemName: 'tag',
      queryKey: ['todo-list', 'tags']
    })
  }, [item])

  return (
    <SidebarItem
      active={searchParams.get('tag') === item.id}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleUpdateTag}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteTag}
          />
        </>
      }
      icon="tabler:hash"
      name={item.name}
      number={item.amount}
      onCancelButtonClick={() => {
        searchParams.delete('tag')
        setSearchParams(searchParams)
        setSidebarOpen(false)
      }}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          tag: item.id
        })
        setSidebarOpen(false)
      }}
    />
  )
}

export default TaskTagListItem
