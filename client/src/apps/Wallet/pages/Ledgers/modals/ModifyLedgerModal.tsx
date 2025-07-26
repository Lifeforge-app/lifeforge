export default function ModifyLedgerModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    initialData: ISchemaWithPB<WalletCollectionsSchemas.ILedgerAggregated> | null | null
  }
  onClose: () => void
}) {
  const [formState, setFormState] = useState<
    WalletControllersSchemas.ILedgers['createLedger' | 'updateLedger']['body']
  >({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'name',
      required: true,
      label: 'Ledger name',
      icon: 'tabler:book',
      placeholder: 'My Ledgers',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'Ledger icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'Ledger color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (type === 'update' && initialData) {
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
      endpoint="wallet/ledgers"
      fields={FIELDS}
      icon={type === 'create' ? 'tabler:plus' : 'tabler:pencil'}
      id={initialData?.id}
      namespace="apps.wallet"
      openType={type}
      queryKey={['wallet', 'ledgers']}
      setData={setFormState}
      title={`ledgers.${type}`}
      onClose={onClose}
    />
  )
}
