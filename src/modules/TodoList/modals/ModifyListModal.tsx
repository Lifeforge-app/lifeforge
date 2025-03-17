import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import fetchAPI from '@utils/fetchAPI'

function ModifyListModal() {
  const { t } = useTranslation('modules.todoList')
  const {
    modifyListModalOpenType: openType,
    setModifyListModalOpenType: setOpenType,
    refreshLists,
    selectedList
  } = useTodoListContext()
  const [data, setData] = useState({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      required: true,
      label: 'List name',
      icon: 'tabler:list',
      placeholder: 'List name',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'List icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'List color',
      type: 'color'
    }
  ]

  async function onSubmitButtonClick() {
    const { name, icon, color } = data
    if (
      name.trim().length === 0 ||
      icon.trim().length === 0 ||
      color.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    try {
      await fetchAPI(
        'todo-list/lists' +
          (openType === 'update' ? `/${selectedList?.id}` : ''),
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: data
        }
      )

      setOpenType(null)
      refreshLists()
    } catch {
      toast.error('Error')
    }
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
    <FormModal
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
