import { useTodoListContext } from '@providers/TodoListProvider'
import fetchAPI from '@utils/fetchAPI'
import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'

import { type IFieldProps } from '@interfaces/modal_interfaces'

function ModifyPriorityModal(): React.ReactElement {
  const { t } = useTranslation('modules.todoList')
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

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      label: 'Priority name',
      icon: 'tabler:sort-ascending-numbers',
      placeholder: 'Priority name',
      type: 'text'
    },
    {
      id: 'color',
      label: 'Priority color',
      type: 'color'
    }
  ]

  async function onSubmitButtonClick(): Promise<void> {
    const { name, color } = data
    if (name.trim().length === 0 || color.trim().length === 0) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    try {
      await fetchAPI(
        'todo-list/priorities' +
          (openType === 'update' ? `/${selectedPriority?.id}` : ''),
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: data
        }
      )

      setOpenType(null)
      refreshPriorities()
    } catch {
      toast.error('Failed to update priority data')
    }
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
    <FormModal
      data={data}
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      isOpen={openType !== null}
      namespace="modules.todoList"
      openType={openType}
      setData={setData}
      title={`priority.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyPriorityModal
