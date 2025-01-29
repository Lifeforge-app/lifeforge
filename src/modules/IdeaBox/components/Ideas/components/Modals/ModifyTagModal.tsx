import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import { type IIdeaBoxTag } from '@interfaces/ideabox_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import APIRequest from '@utils/fetchData'

function ModifyTagModal(): React.ReactElement {
  const { t } = useTranslation()
  const {
    modifyTagModalOpenType: openType,
    setModifyTagModalOpenType: setOpenType,
    existedTag: existedData,
    setTags
  } = useIdeaBoxContext()
  const { id } = useParams<{ id: string }>()
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
      label: 'Tag name',
      icon: 'tabler:tag',
      placeholder: 'My tag',
      type: 'text',
      disabled: true
    },
    {
      id: 'icon',
      label: 'Tag icon',
      type: 'icon'
    },
    {
      id: 'color',
      label: 'Tag color',
      type: 'color'
    }
  ]

  function updateDataList(data: IIdeaBoxTag): void {
    if (openType === 'update') {
      setTags(prev =>
        typeof prev !== 'string'
          ? prev.map(tag => (tag.id === existedData?.id ? data : tag))
          : prev
      )
    } else {
      setTags(prev => (typeof prev !== 'string' ? [...prev, data] : prev))
    }
  }

  async function onSubmitButtonClick(): Promise<void> {
    const { name, icon, color } = data
    if (
      name.trim().length === 0 ||
      color.trim().length === 0 ||
      icon.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    const tag = {
      name: name.trim(),
      color: color.trim(),
      icon: icon.trim()
    }

    await APIRequest({
      endpoint:
        'idea-box/tags' +
        (openType === 'update' ? `/${existedData?.id}` : `/${id}`),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: tag,
      successInfo: openType,
      failureInfo: openType,
      callback: res => {
        setOpenType(null)
        updateDataList(res.data)
      },
      onFailure: () => {
        setOpenType(null)
      }
    })
  }

  useEffect(() => {
    if (existedData !== null) {
      setData(existedData)
    } else {
      setData({
        name: '',
        icon: '',
        color: ''
      })
    }
  }, [openType, existedData])

  return (
    <Modal
      isOpen={openType !== null}
      fields={FIELDS}
      data={data}
      setData={setData}
      title={`${
        {
          create: 'Create ',
          update: 'Update '
        }[openType!]
      } tag`}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      openType={openType}
      onClose={() => {
        setOpenType(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyTagModal
