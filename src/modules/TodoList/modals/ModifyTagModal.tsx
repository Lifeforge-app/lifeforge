import fetchAPI from '@utils/fetchAPI'
import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

function ModifyTagModal(): React.ReactElement {
  const { t } = useTranslation('modules.todoList')
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

  const FIELDS: IFieldProps<typeof data>[] = [
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

    try {
      await fetchAPI(
        'todo-list/tags' + (openType === 'update' ? `/${selectedTag?.id}` : ''),
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: data
        }
      )

      setOpenType(null)
      refreshTagsList()
    } catch {
      toast.error('Error')
    }
  }

  useEffect(() => {
    if (openType === 'update' && selectedTag !== null) {
      setData(selectedTag)
    } else {
      setData({ name: '' })
    }
  }, [openType, selectedTag])

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon="tabler:tag"
      isOpen={openType !== null}
      namespace="modules.todoList"
      openType={openType}
      setData={setData}
      title={`tag.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyTagModal
