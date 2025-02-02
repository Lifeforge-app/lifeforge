import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'
import APIRequest from '@utils/fetchData'

function ModifyListModal(): React.ReactElement {
  const { t } = useTranslation('modules.todoList')
  const {
    modifyListModalOpenType: openType,
    setModifyListModalOpenType: setOpenType,
    refreshLists,
    selectedList
  } = useTodoListContext()
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      icon: '',
      color: ''
    }
  )

  const FIELDS: IFieldProps[] = [
    {
      id: 'name',
      label: 'List name',
      icon: 'tabler:list',
      placeholder: 'List name',
      type: 'text'
    },
    {
      id: 'icon',
      label: 'List icon',
      type: 'icon'
    },
    {
      id: 'color',
      label: 'List color',
      type: 'color'
    }
  ]

  async function onSubmitButtonClick(): Promise<void> {
    const { name, icon, color } = data
    if (
      name.trim().length === 0 ||
      icon.trim().length === 0 ||
      color.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    await APIRequest({
      endpoint:
        'todo-list/lists' +
        (openType === 'update' ? `/${selectedList?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: data,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        setOpenType(null)
        refreshLists()
      }
    })
  }

  useEffect(() => {
    if (openType === 'update' && selectedList !== null) {
      setData(selectedList)
    } else {
      setData({
        name: '',
        icon: '',
        color: '#FFFFFF'
      })
    }
  }, [openType, selectedList])

  return (
    <Modal
      data={data}
      fields={FIELDS}
      icon={`${
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }`}
      isOpen={openType !== null}
      namespace="modules.todoList"
      openType={openType}
      setData={setData}
      title={`list.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyListModal
