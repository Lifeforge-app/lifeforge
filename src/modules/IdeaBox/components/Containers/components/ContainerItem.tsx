import { Icon } from '@iconify/react'
import React from 'react'
import { Link } from 'react-router-dom'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
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
      className={`group relative flex flex-col items-center justify-start gap-6 overflow-hidden rounded-lg shadow-custom ${componentBgWithHover}`}
    >
      <div className="flex-center aspect-video w-full bg-bg-800">
        {container.cover !== '' ? (
          <img
            className="aspect-video size-full object-cover"
            alt=""
            src={`${import.meta.env.VITE_API_HOST}/media/${
              container.cover
            }?thumb=0x200`}
          />
        ) : (
          <Icon icon="tabler:bulb" className="size-24 text-bg-700" />
        )}
      </div>
      <div className="flex flex-col items-center justify-start gap-6 p-8 pt-0">
        <div className="-mt-12 overflow-hidden rounded-lg bg-bg-950">
          <div
            style={{
              backgroundColor: container.color + '30',
              borderColor: container.color
            }}
            className="p-4"
          >
            <Icon
              icon={container.icon}
              className="size-8"
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
            <Icon icon="tabler:article" className="size-5 text-bg-500" />
            <span className="text-bg-500">{container.text_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="tabler:link" className="size-5 text-bg-500" />
            <span className="text-bg-500">{container.link_count}</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="tabler:photo" className="size-5 text-bg-500" />
            <span className="text-bg-500">{container.image_count}</span>
          </div>
        </div>
      </div>
      <Link
        to={`/idea-box/${container.id}`}
        className="absolute left-0 top-0 size-full"
      />
      <HamburgerMenu
        lighter
        className="absolute right-4 top-4 overscroll-contain opacity-0 transition-all group-hover:opacity-100 data-[open]:opacity-100"
      >
        <MenuItem
          onClick={() => {
            setExistedData(container)
            setCreateContainerModalOpen('update')
          }}
          icon="tabler:edit"
          text="Edit"
        />
        <MenuItem
          onClick={() => {
            setExistedData(container)
            setDeleteContainerConfirmationModalOpen(true)
          }}
          icon="tabler:trash"
          text="Delete"
          isRed
        />
      </HamburgerMenu>
    </div>
  )
}

export default ContainerItem
