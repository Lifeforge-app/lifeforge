import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Link } from 'react-router'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import { type IIdeaBoxContainer } from '../../../interfaces/ideabox_interfaces'

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
}) {
  const { componentBgWithHover } = useComponentBg()

  return (
    <div
      className={clsx(
        'shadow-custom group relative flex flex-col items-center justify-start gap-6 overflow-hidden rounded-lg',
        componentBgWithHover
      )}
    >
      <div className="flex-center bg-bg-200 dark:bg-bg-800 aspect-video w-full">
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
            className="text-bg-300 dark:text-bg-700 size-24"
            icon="tabler:bulb"
          />
        )}
      </div>
      <div className="flex flex-col items-center justify-start gap-6 p-8 pt-0">
        <div className="bg-bg-950 -mt-12 overflow-hidden rounded-lg">
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
        <div className="text-center text-2xl font-medium">{container.name}</div>
        <div className="mt-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon className="text-bg-500 size-5" icon="tabler:article" />
            <span className="text-bg-500">{container.text_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon className="text-bg-500 size-5" icon="tabler:link" />
            <span className="text-bg-500">{container.link_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon className="text-bg-500 size-5" icon="tabler:photo" />
            <span className="text-bg-500">{container.image_count}</span>
          </div>
        </div>
      </div>
      <Link
        className="absolute left-0 top-0 size-full"
        to={`/idea-box/${container.id}`}
      />
      <HamburgerMenu
        classNames={{
          wrapper: 'absolute z-[9999] right-4 top-4'
        }}
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
