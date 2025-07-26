function ModifyFolderModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData: ISchemaWithPB<IdeaBoxCollectionsSchemas.IFolder> | null
  }
  onClose: () => void
}) {
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const [formState, setFormState] = useState<
    IdeaBoxControllersSchemas.IFolders['createFolder' | 'updateFolder']['body']
  >({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Folder name',
      icon: 'tabler:folder',
      placeholder: 'My Folder',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Folder icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'Folder color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (type === 'update' && initialData !== null) {
      setFormState({
        name: initialData.name,
        icon: initialData.icon,
        color: initialData.color
      })
    } else {
      setFormState({
        name: '',
        icon: '',
        color: ''
      })
    }
  }, [type, initialData])

  return (
    <FormModal
      data={formState}
      endpoint="idea-box/folders"
      fields={FIELDS}
      getFinalData={async data => {
        return {
          ...data,
          container: id,
          parent: path?.split.pop()
        }
      }}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type]
      }
      id={initialData?.id}
      namespace="apps.ideaBox"
      openType={type}
      queryKey={['idea-box', 'folders', id!, path!]}
      setData={setFormState}
      title={`folder.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyFolderModal
