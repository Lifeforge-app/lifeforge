import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import APIRequest from '@utils/fetchData'

function ModifyContainerModal({
  openType,
  setOpenType,
  setContainerList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  setContainerList: React.Dispatch<React.SetStateAction<IIdeaBoxContainer[]>>
  existedData: IIdeaBoxContainer | null
}): React.ReactElement {
  const { t } = useTranslation('modules.ideaBox')

  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      icon: '',
      color: '',
      cover: {
        image: null as File | string | null,
        preview: null as string | null
      }
    }
  )

  const FIELDS: IFieldProps[] = [
    {
      id: 'name',
      label: 'Container name',
      icon: 'tabler:cube',
      placeholder: 'My container',
      type: 'text'
    },
    {
      id: 'icon',
      label: 'Container icon',
      type: 'icon'
    },
    {
      id: 'color',
      label: 'Container color',
      type: 'color'
    },
    {
      id: 'cover',
      label: 'Cover Image',
      type: 'file'
    }
  ]

  function updateDataList(data: IIdeaBoxContainer): void {
    if (openType === 'update') {
      setContainerList(prev =>
        prev.map(container =>
          container.id === existedData?.id ? data : container
        )
      )
    } else {
      setContainerList(prev => [...prev, data])
    }
  }

  async function onSubmitButtonClick(): Promise<void> {
    const { name, icon, color, cover } = data
    if (
      name.trim().length === 0 ||
      color.trim().length === 0 ||
      icon.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    if (cover.image instanceof File) {
      const formData = new FormData()
      formData.append('file', cover.image)
      formData.append('name', name.trim())
      formData.append('color', color.trim())
      formData.append('icon', icon.trim())

      await APIRequest({
        endpoint:
          'idea-box/containers' +
          (openType === 'update' ? `/${existedData?.id}` : ''),
        method: openType === 'create' ? 'POST' : 'PATCH',
        body: formData,
        isJSON: false,
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
    } else {
      const container = {
        name: name.trim(),
        color: color.trim(),
        icon: icon.trim(),
        cover: cover.image
      }

      await APIRequest({
        endpoint:
          'idea-box/containers' +
          (openType === 'update' ? `/${existedData?.id}` : ''),
        method: openType === 'create' ? 'POST' : 'PATCH',
        body: container,
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
  }

  useEffect(() => {
    if (openType === 'update' && existedData !== null) {
      setData({
        ...existedData,
        cover:
          existedData.cover !== ''
            ? {
                image: 'keep',
                preview: `${import.meta.env.VITE_API_HOST}/media/${
                  existedData.cover
                }`
              }
            : {
                image: null,
                preview: null
              }
      })
    } else {
      setData({
        name: '',
        icon: '',
        color: '',
        cover: {
          image: null,
          preview: null
        }
      })
    }
  }, [openType, existedData])

  return (
    <Modal
      namespace="modules.ideaBox"
      isOpen={openType !== null}
      fields={FIELDS}
      data={data}
      setData={setData}
      title={`container.${openType}`}
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

export default ModifyContainerModal
