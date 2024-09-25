/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { t } from 'i18next'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/Modals/Modal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'
import APIRequest from '@utils/fetchData'

function ModifyPriorityModal(): React.ReactElement {
  const {
    modifyPriorityModalOpenType: openType,
    setModifyPriorityModalOpenType: setOpenType,
    refreshPriorities,
    selectedPriority
  } = useTodoListContext()
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      color: ''
    }
  )

  const FIELDS: IFieldProps[] = [
    {
      id: 'name',
      name: 'Priority name',
      icon: 'tabler:sort-ascending-numbers',
      placeholder: 'Priority name',
      type: 'text'
    },
    {
      id: 'color',
      name: 'Priority color',
      type: 'color'
    }
  ]

  async function onSubmitButtonClick(): Promise<void> {
    const { name, color } = data
    if (name.trim().length === 0 || color.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    await APIRequest({
      endpoint:
        'todo-list/priorities' +
        (openType === 'update' ? `/${selectedPriority?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: data,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        setOpenType(null)
        refreshPriorities()
      }
    })
  }

  useEffect(() => {
    if (openType === 'update' && selectedPriority !== null) {
      setData(selectedPriority)
    } else {
      setData({
        name: '',
        color: '#FFFFFF'
      })
    }
  }, [openType, selectedPriority])

  return (
    <Modal
      openType={openType}
      setOpenType={setOpenType}
      title={`${
        {
          create: 'Create ',
          update: 'Update '
        }[openType!]
      }priority`}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      fields={FIELDS}
      data={data}
      setData={setData}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyPriorityModal
