import ModifyTypeModal from '../../modals/ModifyTypeModal'

function SidebarTypeItem({
  data,
  isActive,
  onCancel,
  onSelect
}: {
  data: ISchemaWithPB<ScoresLibraryCollectionsSchemas.ITypeAggregated>
  isActive: boolean
  onCancel: () => void
  onSelect: (category: string) => void
}) {
  const open = useModalStore(state => state.open)

  const handleSelect = useCallback(() => {
    onSelect(data.id)
  }, [])

  const handleUpdate = useCallback(() => {
    open(ModifyTypeModal, {
      openType: 'update',
      existedData: data
    })
  }, [data])

  const handleDelete = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'scores-library/types',
      queryKey: [
        ['scores-library', 'types'],
        ['scores-library', 'sidebar-data']
      ],
      queryUpdateType: 'invalidate',
      multiQueryKey: true,
      data,
      nameKey: 'name' as const
    })
  }, [])

  return (
    <SidebarItem
      key={data.id}
      active={isActive}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            namespace="apps.scoresLibrary"
            text="update type"
            onClick={handleUpdate}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            namespace="apps.scoresLibrary"
            text="delete type"
            onClick={handleDelete}
          />
        </>
      }
      icon={data.icon}
      name={data.name}
      namespace="apps.scoresLibrary"
      number={data.amount}
      onCancelButtonClick={onCancel}
      onClick={handleSelect}
    />
  )
}

export default SidebarTypeItem
