import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import APIRequest from '@utils/fetchData'

function ModifyModal({
  stuff
}: {
  stuff: 'categories' | 'technologies' | 'visibilities' | 'statuses'
}): React.ReactElement {
  const { t } = useTranslation()
  const {
    modifyDataModalOpenType: openType,
    setModifyDataModalOpenType: setOpenType,
    existedData,
    setExistedData,
    refreshData
  } = useProjectsMContext()[stuff]
  const singleStuff = {
    categories: 'category',
    technologies: 'technology',
    visibilities: 'visibility',
    statuses: 'status'
  }[stuff]
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      name: '',
      icon: '',
      ...(stuff === 'statuses' && { color: '' })
    }
  )
  const FIELDS: IFieldProps[] = [
    {
      id: 'name',
      label: `${singleStuff} name`,
      icon: 'tabler:book',
      placeholder: `Project ${singleStuff}`,
      type: 'text'
    },
    {
      id: 'icon',
      label: `${singleStuff} icon`,
      type: 'icon'
    },
    ...(stuff === 'statuses'
      ? [
          {
            id: 'color',
            label: `${singleStuff} color`,
            type: 'color' as const
          }
        ]
      : [])
  ]

  useEffect(() => {
    if (openType) {
      if (openType === 'update') {
        if (existedData) {
          setData(existedData)
        }
      } else {
        setData({
          name: '',
          icon: '',
          ...(stuff === 'statuses' && { color: '#FFFFFF' })
        })
      }
    }
  }, [openType, existedData])

  async function onSubmitButtonClick(): Promise<void> {
    const { name, icon, color } = data
    if (
      name.trim().length === 0 ||
      icon.trim().length === 0 ||
      (stuff === 'statuses' && !color)
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    await APIRequest({
      endpoint: `projects-m/${stuff}${
        openType === 'update' ? `/${existedData?.id}` : ''
      }`,
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: {
        name,
        icon,
        ...(stuff === 'statuses' && { color })
      },
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        refreshData()
        setExistedData(null)
        setOpenType(null)
      }
    })
  }

  return (
    <Modal
      isOpen={openType !== null}
      data={data}
      setData={setData}
      title={
        openType === 'update' ? `Edit ${singleStuff}` : `Add ${singleStuff}`
      }
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      openType={openType}
      onClose={() => {
        setOpenType(null)
        setExistedData(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyModal
