function ModifyWishlistListModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData: ISchemaWithPB<WishlistCollectionsSchemas.IListAggregated> | null
  }
  onClose: () => void
}) {
  const [data, setData] = useState<
    WishlistControllersSchemas.ILists['createList' | 'updateList']['body']
  >({
    name: '',
    description: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      required: true,
      label: 'Wishlist name',
      icon: 'tabler:list',
      placeholder: 'My wishlist',
      type: 'text'
    },
    {
      id: 'description',
      label: 'Wishlist description',
      icon: 'tabler:file-text',
      placeholder: 'My wishlist description',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Wishlist icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'Wishlist color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (type === 'update' && initialData !== null) {
      setData({
        name: initialData.name,
        description: initialData.description,
        icon: initialData.icon,
        color: initialData.color
      })
    } else {
      setData({
        name: '',
        description: '',
        icon: '',
        color: ''
      })
    }
  }, [type, initialData])

  return (
    <FormModal
      data={data}
      endpoint="wishlist/lists"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }
      id={initialData?.id}
      namespace="apps.wishlist"
      openType={type}
      queryKey={['wishlist', 'lists']}
      setData={setData}
      title={`wishlist.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyWishlistListModal
