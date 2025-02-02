import { Menu, MenuButton, MenuItems } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import { useTranslation } from 'react-i18next'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'

function TypeSelector({
  inline = false,
  innerTypeOfModifyIdea,
  setInnerTypeOfModifyIdea
}: {
  inline?: boolean
  innerTypeOfModifyIdea: 'text' | 'image' | 'link'
  setInnerTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'text' | 'image' | 'link'>
  >
}): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')

  return (
    <Menu
      as="div"
      className={`relative text-left ${
        inline ? 'hidden sm:inline' : 'mb-8 mt-4 block sm:hidden'
      }`}
    >
      <MenuButton
        className={`flex-between inline-flex w-full rounded-md border-2 border-bg-300 sm:w-auto ${
          inline ? 'p-2 px-4' : 'p-4 px-6'
        } text-lg font-semibold tracking-wide text-bg-800 outline-hidden hover:bg-bg-100 focus:outline-hidden dark:border-bg-800 dark:bg-bg-900 dark:text-bg-200`}
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
        className="z-9999 mt-2 overflow-hidden rounded-lg bg-bg-100 text-bg-800 shadow-lg outline-hidden transition duration-100 ease-out focus:outline-hidden data-closed:scale-95 data-closed:opacity-0 dark:bg-bg-800"
      >
        {[
          ['text', 'tabler:article'],
          ...[['image', 'tabler:photo']],
          ['link', 'tabler:link']
        ].map(([type, icon]) => (
          <MenuItem
            key={type}
            icon={icon}
            isToggled={innerTypeOfModifyIdea === type}
            namespace={false}
            text={t(`entryType.${type}`)}
            onClick={() =>
              setInnerTypeOfModifyIdea(type as 'text' | 'image' | 'link')
            }
          />
        ))}
      </MenuItems>
    </Menu>
  )
}

export default TypeSelector
