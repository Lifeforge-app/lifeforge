function ModifyAssetModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    initialData: ISchemaWithPB<WalletCollectionsSchemas.IAssetAggregated> | null | null
  }
  onClose: () => void
}) {
  const [formState, setFormState] = useState<
    WalletControllersSchemas.IAssets['createAsset' | 'updateAsset']['body']
  >({
    name: '',
    icon: '',
    starting_balance: 0
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Asset name',
      icon: 'tabler:wallet',
      placeholder: 'My assets',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Asset icon',
      type: 'icon'
    },
    {
      id: 'starting_balance',
      required: true,
      label: 'Initial Balance',
      icon: 'tabler:currency-dollar',
      placeholder: '0.00',
      type: 'number'
    }
  ]

  useEffect(() => {
    if (type) {
      if (type === 'update') {
        if (initialData) {
          setFormState({
            name: initialData.name,
            icon: initialData.icon,
            starting_balance: initialData.starting_balance
          })
        }
      } else {
        setFormState({
          name: '',
          icon: '',
          starting_balance: 0
        })
      }
    }
  }, [type, initialData])

  return (
    <FormModal
      data={formState}
      endpoint="wallet/assets"
      fields={FIELDS}
      icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={initialData?.id}
      namespace="apps.wallet"
      openType={type}
      queryKey={['wallet', 'assets']}
      setData={setFormState}
      title={`assets.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyAssetModal
