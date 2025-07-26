function ModifyTagModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData: ISchemaWithPB<IdeaBoxCollectionsSchemas.ITag> | null
  }
  onClose: () => void
}) {
  const { id } = useParams<{ id: string }>()

  const [formState, setFormState] = useState<
    IdeaBoxControllersSchemas.ITags['createTag' | 'updateTag']['body']
  >({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      label: 'Tag name',
      icon: 'tabler:tag',
      placeholder: 'My tag',
      type: 'text',
      disabled: true
    },
    {
      id: 'icon',
      label: 'Tag icon',
      type: 'icon'
    },
    {
      id: 'color',
      label: 'Tag color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (initialData !== null) {
      setFormState(initialData)
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
      endpoint="idea-box/tags"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }
      id={initialData?.id}
      namespace="apps.ideaBox"
      openType={type}
      queryKey={['idea-box', 'tags', id!]}
      setData={setFormState}
      title={`tag.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyTagModal
