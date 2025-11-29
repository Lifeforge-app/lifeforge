import { Icon } from '@iconify/react'

import { Card } from '@components/layout'

import type { IIconSet } from '../../../typescript/icon_selector_interfaces'

function IconSetEntry({
  iconSet,
  setCurrentIconSet
}: {
  iconSet: IIconSet
  setCurrentIconSet: ({ iconSet }: { iconSet: string }) => void
}) {
  return (
    <Card
      key={iconSet.prefix}
      isInteractive
      className="component-bg-lighter-with-hover flex w-full grow flex-col overflow-hidden"
      onClick={() => {
        setCurrentIconSet({ iconSet: iconSet.prefix })
      }}
    >
      <div className="flex w-full shrink-0 flex-col py-6 font-medium">
        <div className="flex-center size-full gap-5">
          {iconSet.samples?.map(sampleIcon => (
            <Icon
              key={sampleIcon}
              className="text-bg-500 size-8 shrink-0"
              icon={`${iconSet.prefix}:${sampleIcon}`}
            />
          ))}
        </div>
      </div>
      <div className="flex w-full flex-col justify-between text-left">
        <h3 className="truncate text-xl font-semibold">{iconSet.name}</h3>
        <p className="text-custom-500 truncate text-sm">
          {iconSet.author.name}
        </p>
        <div className="sssm:py-0 flex-between border-bg-200 dark:border-bg-700 mt-4 flex w-full border-t pt-4 text-sm">
          <p>{iconSet.total?.toLocaleString()} icons</p>
          {iconSet.height !== undefined && (
            <div className="flex items-center">
              <Icon
                height="20"
                icon="icon-park-outline:auto-height-one"
                width="20"
              />
              <p className="ml-2">{iconSet.height}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default IconSetEntry
