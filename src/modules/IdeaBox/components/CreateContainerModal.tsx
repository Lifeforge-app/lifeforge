import React, { useState } from 'react'
import Modal from '../../../components/Modal'
import { Icon } from '@iconify/react/dist/iconify.js'
import { SketchPicker } from 'react-color'
import ColorPickerModal from '../../../components/ColorPickerModal'

function CreateContainerModal({
  isOpen
}: {
  isOpen: boolean
}): React.ReactElement {
  const [containerName, setContainerName] = useState('')
  const [containerColor, setContainerColor] = useState('#FFFFFF')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  function updateContainerName(e: React.ChangeEvent<HTMLInputElement>): void {
    setContainerName(e.target.value)
  }

  function updateContainerColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setContainerColor(e.target.value)
  }

  return (
    <>
      <Modal isOpen={isOpen}>
        <h1 className="mb-8 flex items-center gap-3 text-2xl font-semibold">
          <Icon icon="tabler:cube-plus" className="h-7 w-7" />
          Create container
        </h1>
        <div className="group relative flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-800/50 focus-within:border-teal-500">
          <Icon
            icon="tabler:cube"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-teal-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-teal-500 ${
                containerName.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }`}
            >
              Container name
            </span>
            <input
              value={containerName}
              onChange={updateContainerName}
              placeholder="My container"
              className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-500"
            />
          </div>
        </div>
        <div className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-800/50 focus-within:border-teal-500">
          <Icon
            icon="tabler:palette"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-teal-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-teal-500 ${
                containerColor.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }`}
            >
              Container color
            </span>
            <div className="mr-12 mt-6 flex w-full items-center gap-2 pl-4">
              <div
                className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor: containerColor
                }}
              ></div>
              <input
                value={containerColor}
                onChange={updateContainerColor}
                placeholder="#FFFFFF"
                className="h-8 w-full rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-500"
              />
            </div>
            <button
              onClick={() => {
                setColorPickerOpen(true)
              }}
              className="mr-4 shrink-0 rounded-lg p-2 text-neutral-500 hover:bg-neutral-500/30 hover:text-neutral-200 focus:outline-none"
            >
              <Icon icon="tabler:color-picker" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </Modal>
      <ColorPickerModal
        isOpen={colorPickerOpen}
        setOpen={setColorPickerOpen}
        color={containerColor}
        setColor={setContainerColor}
      />
    </>
  )
}

export default CreateContainerModal
