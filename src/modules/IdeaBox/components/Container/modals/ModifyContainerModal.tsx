/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import Modal from '../../../../../components/general/Modal'
import { Icon } from '@iconify/react/dist/iconify.js'
import ColorPickerModal from '../../../../../components/general/ColorPickerModal'
import { toast } from 'react-toastify'
import { type IIdeaBoxContainer } from '../../..'
import { useDebounce } from '@uidotdev/usehooks'
import IconInput from '../../../../../components/general/IconSelector/IconInput'
import Input from '../../../../../components/general/Input'

function ModifyContainerModal({
  openType,
  setOpenType,
  updateContainerList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateContainerList: () => void
  existedData: IIdeaBoxContainer | null
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [containerName, setContainerName] = useState('')
  const [containerColor, setContainerColor] = useState('#FFFFFF')
  const [containerIcon, setContainerIcon] = useState('tabler:cube')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateContainerName(e: React.ChangeEvent<HTMLInputElement>): void {
    setContainerName(e.target.value)
  }

  function updateContainerColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setContainerColor(e.target.value)
  }

  function updateContainerIcon(e: React.ChangeEvent<HTMLInputElement>): void {
    setContainerIcon(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (
      containerName.trim().length === 0 ||
      containerColor.trim().length === 0 ||
      containerIcon.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const container = {
      name: containerName.trim(),
      color: containerColor.trim(),
      icon: containerIcon.trim()
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/idea-box/container/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData!.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'PUT' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(container)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.status !== 200) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Container created. Time to fill it up.',
            update: 'Yay! Container updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateContainerList()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the container. Please try again.",
            update: "Oops! Couldn't update the container. Please try again."
          }[innerOpenType!]
        )
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (innerOpenType === 'update' && existedData !== null) {
      setContainerName(existedData.name)
      setContainerColor(existedData.color)
      setContainerIcon(existedData.icon)
    } else {
      setContainerName('')
      setContainerColor('#FFFFFF')
      setContainerIcon('tabler:cube')
    }
  }, [innerOpenType, existedData])

  return (
    <>
      <Modal isOpen={openType !== null}>
        <div className="mb-8 flex items-center justify-between ">
          <h1 className="flex items-center gap-3 text-2xl font-semibold">
            <Icon
              icon={
                {
                  create: 'tabler:plus',
                  update: 'tabler:pencil'
                }[innerOpenType!]
              }
              className="h-7 w-7"
            />
            {
              {
                create: 'Create ',
                update: 'Update '
              }[innerOpenType!]
            }{' '}
            container
          </h1>
          <button
            onClick={() => {
              setOpenType(null)
            }}
            className="rounded-md p-2 text-neutral-500 transition-all hover:bg-neutral-200/50 hover:text-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800"
          >
            <Icon icon="tabler:x" className="h-6 w-6" />
          </button>
        </div>
        <Input
          name="Container name"
          icon="tabler:cube"
          value={containerName}
          updateValue={updateContainerName}
          darker
          placeholder="My container"
        />
        <div className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 focus-within:border-custom-500 dark:bg-neutral-800/50">
          <Icon
            icon="tabler:palette"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-custom-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-custom-500 ${
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
                className="h-8 w-full rounded-lg bg-transparent p-6 pl-0 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-400"
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
        <IconInput
          name="Container icon"
          icon={containerIcon}
          setIcon={setContainerIcon}
        />
        <button
          disabled={loading}
          className="mt-8 flex h-16 items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-neutral-800 transition-all hover:bg-custom-600"
          onClick={onSubmitButtonClick}
        >
          {!loading ? (
            <>
              <Icon
                icon={
                  {
                    create: 'tabler:plus',
                    update: 'tabler:pencil'
                  }[innerOpenType!]
                }
                className="h-5 w-5"
              />
              {
                {
                  create: 'CREATE',
                  update: 'UPDATE'
                }[innerOpenType!]
              }
            </>
          ) : (
            <span className="small-loader-dark"></span>
          )}
        </button>
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

export default ModifyContainerModal
