/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { t } from 'i18next'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/Modals/Modal'
import { type IIdeaBoxContainer } from '@interfaces/ideabox_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import APIRequest from '@utils/fetchData'

function ModifyContainerModal({
  openType,
  setOpenType,
  updateContainerList,
  existedData
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateContainerList: () => void
  existedData: IIdeaBoxContainer | null
}): React.ReactElement {
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
      name: 'Container name',
      icon: 'tabler:cube',
      placeholder: 'My container',
      type: 'text'
    },
    {
      id: 'icon',
      name: 'Container icon',
      type: 'icon'
    },
    {
      id: 'color',
      name: 'Container color',
      type: 'color'
    }
  ]

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

    const container = {
      name: name.trim(),
      color: color.trim(),
      icon: icon.trim()
    }

    await APIRequest({
      endpoint:
        'idea-box/container' +
        (openType === 'update' ? `/${existedData?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: container,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        setOpenType(null)
        updateContainerList()
      },
      onFailure: () => {
        setOpenType(null)
      }
    })
  }

  useEffect(() => {
    if (openType === 'update' && existedData !== null) {
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
      fields={FIELDS}
      data={data}
      setData={setData}
      title={`${
        {
          create: 'Create ',
          update: 'Update '
        }[openType!]
      } container`}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      openType={openType}
      setOpenType={setOpenType}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyContainerModal
