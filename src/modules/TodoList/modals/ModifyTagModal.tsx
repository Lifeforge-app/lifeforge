/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { t } from 'i18next'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/Modals/Modal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'
import APIRequest from '@utils/fetchData'

function ModifyTagModal(): React.ReactElement {
  const {
    modifyTagModalOpenType: openType,
    setModifyTagModalOpenType: setOpenType,
    refreshTagsList,
    selectedTag
  } = useTodoListContext()
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: ''
    }
  )

  const FIELDS: IFieldProps[] = [
    {
      id: 'name',
      label: 'Tag name',
      icon: 'tabler:tag',
      placeholder: 'Tag name',
      type: 'text'
    }
  ]

  async function onSubmitButtonClick(): Promise<void> {
    if (data.name.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    await APIRequest({
      endpoint:
        'todo-list/tags' + (openType === 'update' ? `/${selectedTag?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: data,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        setOpenType(null)
        refreshTagsList()
      }
    })
  }

  useEffect(() => {
    if (openType === 'update' && selectedTag !== null) {
      setData(selectedTag)
    } else {
      setData({ name: '' })
    }
  }, [openType, selectedTag])

  return (
    <Modal
      isOpen={openType !== null}
      openType={openType}
      onClose={() => {
        setOpenType(null)
      }}
      title={`${
        {
          create: 'Create',
          update: 'Update'
        }[openType!]
      } tag`}
      icon="tabler:tag"
      data={data}
      setData={setData}
      fields={FIELDS}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyTagModal
