/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { useDebounce } from '@uidotdev/usehooks'
import Modal from '../../../components/Modal'
import ColorPickerModal from '../../../components/ColorPickerModal'
import { type ICodeSnippetsLabel } from './Sidebar/Labels'

function ModifyLabelModal({
  openType,
  setOpenType,
  updateLabelList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateLabelList: () => void
  existedData: ICodeSnippetsLabel | null
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [labelName, setLabelName] = useState('')
  const [labelColor, setLabelColor] = useState('#FFFFFF')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateLabelName(e: React.ChangeEvent<HTMLInputElement>): void {
    setLabelName(e.target.value)
  }

  function updateLabelColor(e: React.ChangeEvent<HTMLInputElement>): void {
    setLabelColor(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (labelName.trim().length === 0 || labelColor.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const label = {
      name: labelName.trim(),
      color: labelColor.trim()
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/code-snippets/label/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData!.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'PUT' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(label)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.status !== 200) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Label created. Time to fill it up.',
            update: 'Yay! Label updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateLabelList()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the label. Please try again.",
            update: "Oops! Couldn't update the label. Please try again."
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
      setLabelName(existedData.name)
      setLabelColor(existedData.color)
    } else {
      setLabelName('')
      setLabelColor('#FFFFFF')
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
            label
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
        <div className="group relative flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 focus-within:border-custom-500 dark:bg-neutral-800/50">
          <Icon
            icon="tabler:tag"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-custom-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-custom-500 ${
                labelName.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }`}
            >
              Label name
            </span>
            <input
              value={labelName}
              onChange={updateLabelName}
              placeholder="My label"
              className="mt-6 h-8 w-full rounded-lg bg-transparent p-6 pl-4 tracking-wide placeholder:text-transparent focus:outline-none focus:placeholder:text-neutral-400"
            />
          </div>
        </div>
        <div className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-neutral-500 bg-neutral-200/50 focus-within:border-custom-500 dark:bg-neutral-800/50">
          <Icon
            icon="tabler:palette"
            className="ml-6 h-6 w-6 shrink-0 text-neutral-500 group-focus-within:text-custom-500"
          />

          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-neutral-500 group-focus-within:text-custom-500 ${
                labelColor.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }`}
            >
              Label color
            </span>
            <div className="mr-12 mt-6 flex w-full items-center gap-2 pl-4">
              <div
                className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
                style={{
                  backgroundColor: labelColor
                }}
              ></div>
              <input
                value={labelColor}
                onChange={updateLabelColor}
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
        color={labelColor}
        setColor={setLabelColor}
      />
    </>
  )
}

export default ModifyLabelModal
