/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { toast } from 'react-toastify'
import { useDebounce } from '@uidotdev/usehooks'
import Modal from '../../../components/general/Modal'
import CreateOrModifyButton from '../../../components/general/CreateOrModifyButton'
import Input from '../../../components/general/Input'
import { type ITodoListTag } from './Sidebar'

function ModifyTagModal({
  openType,
  setOpenType,
  updateTagsList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateTagsList: () => void
  existedData: ITodoListTag | null
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [tagName, setTagName] = useState('')
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateTagName(e: React.ChangeEvent<HTMLInputElement>): void {
    setTagName(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (tagName.trim().length === 0) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const tag = {
      name: tagName.trim()
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/todo-list/tag/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tag)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.status !== 200) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Tag created. Time to fill it up.',
            update: 'Yay! Tag updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateTagsList()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the tag. Please try again.",
            update: "Oops! Couldn't update the tag. Please try again."
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
      setTagName(existedData.name)
    } else {
      setTagName('')
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
            tag
          </h1>
          <button
            onClick={() => {
              setOpenType(null)
            }}
            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
          >
            <Icon icon="tabler:x" className="h-6 w-6" />
          </button>
        </div>
        <Input
          name="Tag name"
          value={tagName}
          updateValue={updateTagName}
          placeholder="Tag name"
          icon="tabler:tag"
          darker
        />

        <CreateOrModifyButton
          loading={loading}
          onClick={onSubmitButtonClick}
          type={innerOpenType}
        />
      </Modal>
    </>
  )
}

export default ModifyTagModal
