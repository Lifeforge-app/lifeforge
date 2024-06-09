import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import ListboxTransition from '@components/ListBox/ListboxTransition'

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
  className?: string
}

function AssetListbox({
  assets,
  selectedAsset,
  onAssetChange,
  label,
  iconName,
  className = ''
}: AssetListboxProps): React.ReactElement {
  return (
    <Listbox
      value={selectedAsset}
      onChange={onAssetChange}
      as="div"
      className={`group relative mb-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50 ${className}`}
    >
      <Listbox.Button className="flex w-full items-center">
        <Icon
          icon={iconName}
          className={`ml-6 size-6 shrink-0 ${
            selectedAsset !== null ? '' : 'text-bg-500'
          } group-focus-within:!text-custom-500`}
        />
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
        >
          {label}
        </span>
        <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
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
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
          <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
        </span>
      </Listbox.Button>
      <ListboxTransition>
        <Listbox.Options className="absolute top-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800">
          {assets.map(({ name, id, icon }, i) => (
            <Listbox.Option
              key={i}
              className={({ active }) =>
                `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                  active ? 'bg-bg-500/30 dark:bg-bg-700/50' : '!bg-transparent'
                }`
              }
              value={id}
            >
              {({ selected }) => (
                <>
                  <div>
                    <span className="flex items-center gap-2">
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
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </ListboxTransition>
    </Listbox>
  )
}

export default AssetListbox
