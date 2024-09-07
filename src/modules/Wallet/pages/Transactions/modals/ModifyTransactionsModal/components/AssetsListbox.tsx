import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'

interface Asset {
  id: string | number
  name: string
  icon: string // Assuming you're using a library like @iconify/react
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
}: AssetListboxProps): React.ReactElement {
  return (
    <ListboxInput
      name={label}
      icon={iconName}
      value={selectedAsset}
      setValue={onAssetChange}
      buttonContent={
        <>
          <Icon
            icon={
              assets.find(l => l.id === selectedAsset)?.icon ??
              'tabler:wallet-off'
            }
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {assets.find(l => l.id === selectedAsset)?.name ?? 'None'}
          </span>
        </>
      }
    >
      {assets.map(({ name, id, icon }, i) => (
        <ListboxOption
          key={i}
          className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-bg-200/50 hover:dark:bg-bg-700/50"
          value={id}
        >
          {({ selected }) => (
            <>
              <div>
                <span className="flex items-center gap-2 font-medium">
                  <Icon icon={icon} className="size-5" />
                  {name}
                </span>
              </div>
              {selected && (
                <Icon
                  icon="tabler:check"
                  className="block text-lg text-custom-500"
                />
              )}
            </>
          )}
        </ListboxOption>
      ))}
    </ListboxInput>
  )
}

export default AssetListbox
