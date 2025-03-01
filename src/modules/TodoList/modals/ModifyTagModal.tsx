import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import FormModal from '@components/modals/FormModal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'
import APIRequest from '@utils/fetchData'

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
