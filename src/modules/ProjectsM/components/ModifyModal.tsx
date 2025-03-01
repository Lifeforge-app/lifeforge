import React, { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Modal from '@components/modals/Modal'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import { useProjectsMContext } from '@providers/ProjectsMProvider'
import APIRequest from '@utils/fetchData'
import { toCamelCase } from '@utils/strings'

function ModifyModal({
  stuff
}: {
  stuff: 'categories' | 'technologies' | 'visibilities' | 'statuses'
}): React.ReactElement {
  const { t } = useTranslation('modules.projectsM')
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
  const FIELDS: IFieldProps<typeof data>[] = [
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
            id: 'color' as const,
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
      data={data}
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      isOpen={openType !== null}
      namespace="modules.projectsM"
      openType={openType}
      setData={setData}
      title={`${toCamelCase(singleStuff)}.${openType}`}
      onClose={() => {
        setOpenType(null)
        setExistedData(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyModal
