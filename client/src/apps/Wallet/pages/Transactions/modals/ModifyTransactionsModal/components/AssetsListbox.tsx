import { Icon } from '@iconify/react'
import { ListboxOrComboboxInput, ListboxOrComboboxOption } from 'lifeforge-ui'

interface Asset {
  id: string
  name: string
  icon: string
}

interface AssetListboxProps {
  assets: Asset[]
  selectedAsset: string | null
  onAssetChange: (asset: string | null) => void
  label: string
  iconName: string
}

function AssetListbox({
  assets,
  selectedAsset,
  onAssetChange,
  label,
  iconName
}: AssetListboxProps) {
  return (
    <ListboxOrComboboxInput
      buttonContent={
        <>
          <Icon
            className="size-5"
            icon={
              assets.find(l => l.id === selectedAsset)?.icon ??
              'tabler:wallet-off'
            }
          />
          <span className="-mt-px block truncate">
            {assets.find(l => l.id === selectedAsset)?.name ?? 'None'}
          </span>
        </>
      }
      icon={iconName}
      name={label}
      namespace="apps.wallet"
      setValue={onAssetChange}
      type="listbox"
      value={selectedAsset}
    >
      {assets.map(({ name, id, icon }, i) => (
        <ListboxOrComboboxOption key={i} icon={icon} text={name} value={id} />
      ))}
    </ListboxOrComboboxInput>
  )
}

export default AssetListbox
