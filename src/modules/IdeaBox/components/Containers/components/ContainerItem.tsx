import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { Link } from 'react-router'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'

function ContainerItem({
  container,
  setCreateContainerModalOpen,
  setExistedData,
  setDeleteContainerConfirmationModalOpen
}: {
  container: IIdeaBoxContainer
  setCreateContainerModalOpen: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<IIdeaBoxContainer | null>>
  setDeleteContainerConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()

  return (
    <div
      className={clsx(
        'group relative flex flex-col items-center justify-start gap-6 overflow-hidden rounded-lg shadow-custom',
        componentBgWithHover
      )}
    >
      <div className="flex-center aspect-video w-full bg-bg-200 dark:bg-bg-800">
        {container.cover !== '' ? (
          <img
            alt=""
            className="aspect-video size-full object-cover"
            src={`${import.meta.env.VITE_API_HOST}/media${
              container.cover
            }?thumb=0x200`}
          />
        ) : (
          <Icon
            className="size-24 text-bg-300 dark:text-bg-700"
            icon="tabler:bulb"
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-start gap-6 p-8 pt-0">
        <div className="-mt-12 overflow-hidden rounded-lg bg-bg-950">
          <div
            className="p-4"
            style={{
              backgroundColor: container.color + '30',
              borderColor: container.color
            }}
          >
            <Icon
              className="size-8"
              icon={container.icon}
              style={{
                color: container.color
              }}
            />
          </div>
        </div>
        <div className="text-center text-2xl font-medium ">
          {container.name}
        </div>
        <div className="mt-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-bg-500" icon="tabler:article" />
            <span className="text-bg-500">{container.text_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-bg-500" icon="tabler:link" />
            <span className="text-bg-500">{container.link_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-bg-500" icon="tabler:photo" />
            <span className="text-bg-500">{container.image_count}</span>
          </div>
        </div>
      </div>
      <Link
        className="absolute left-0 top-0 size-full"
        to={`/idea-box/${container.id}`}
      />
      <HamburgerMenu
        lighter
        className="absolute right-4 top-4 overscroll-contain opacity-0 transition-all group-hover:opacity-100 data-open:opacity-100"
      >
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            setExistedData(container)
            setCreateContainerModalOpen('update')
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setExistedData(container)
            setDeleteContainerConfirmationModalOpen(true)
          }}
        />
      </HamburgerMenu>
    </div>
  )
}

export default ContainerItem
