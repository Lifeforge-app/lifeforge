/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import { useDebounce } from '@uidotdev/usehooks'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/CreateOrModifyButton'
import Input from '@components/Input'
import Modal from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { type ITodoListTag } from '@typedec/TodoList'

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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(tag)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Tag created. Time to start adding tasks.',
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
        <ModalHeader
          title={`${
            {
              create: 'Create ',
              update: 'Update '
            }[innerOpenType!]
          } tag`}
          icon={`${
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[innerOpenType!]
          }`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          name="Tag name"
          value={tagName}
          updateValue={updateTagName}
          placeholder="Tag name"
          icon="tabler:tag"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              onSubmitButtonClick()
            }
          }}
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
