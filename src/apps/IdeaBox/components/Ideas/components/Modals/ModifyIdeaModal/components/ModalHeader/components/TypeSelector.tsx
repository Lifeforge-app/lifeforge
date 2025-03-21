import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { MenuItem } from '@lifeforge/ui'

import { IIdeaBoxEntry } from '@apps/IdeaBox/interfaces/ideabox_interfaces'

function TypeSelector({
  inline = false,
  innerTypeOfModifyIdea,
  setInnerTypeOfModifyIdea
}: {
  inline?: boolean
  innerTypeOfModifyIdea: IIdeaBoxEntry['type']
  setInnerTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<IIdeaBoxEntry['type']>
  >
}) {
  const { t } = useTranslation('apps.ideaBox')

  return (
    <Menu
      as="div"
      className={clsx(
        'relative text-left',
        inline ? 'hidden sm:inline' : 'mb-8 mt-4 block sm:hidden'
      )}
    >
      <MenuButton
        className={clsx(
          'flex-between border-bg-300 text-bg-800 hover:bg-bg-100 dark:border-bg-800 dark:bg-bg-900 dark:text-bg-200 outline-hidden focus:outline-hidden inline-flex w-full rounded-md border-2 text-lg font-semibold tracking-wide sm:w-auto',
          inline ? 'p-2 px-4' : 'p-4 px-6'
        )}
      >
        <div className="flex-center">
          <Icon
            className="mr-2 size-5"
            icon={
              {
                text: 'tabler:article',
                image: 'tabler:photo',
                link: 'tabler:link'
              }[innerTypeOfModifyIdea]
            }
          />
          {t(`entryType.${innerTypeOfModifyIdea}`)}
        </div>
        <Icon
          aria-hidden="true"
          className="-mr-1 ml-2 size-4 stroke-[2px]"
          icon="tabler:chevron-down"
        />
      </MenuButton>
      <MenuItems
        transition
        anchor="bottom start"
        className="bg-bg-100 text-bg-800 dark:bg-bg-800 z-9999 outline-hidden focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 mt-2 overflow-hidden rounded-lg shadow-lg transition duration-100 ease-out"
      >
        {(
          [
            ['text', 'tabler:article'],
            ...[['image', 'tabler:photo']],
            ['link', 'tabler:link']
          ] as const
        ).map(([type, icon]) => (
          <MenuItem
            key={type}
            icon={icon}
            isToggled={innerTypeOfModifyIdea === type}
            namespace={false}
            text={t(`entryType.${type}`)}
            onClick={() => setInnerTypeOfModifyIdea(type)}
          />
        ))}
      </MenuItems>
    </Menu>
  )
}

export default TypeSelector
