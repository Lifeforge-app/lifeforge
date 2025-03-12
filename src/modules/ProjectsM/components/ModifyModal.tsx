import _ from 'lodash'
import { useEffect, useReducer } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { useProjectsMContext } from '../providers/ProjectsMProvider'

function ModifyModal({
  stuff
}: {
  stuff: 'categories' | 'technologies' | 'visibilities' | 'statuses'
}) {
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

  async function onSubmitButtonClick() {
    const { name, icon, color } = data
    if (
      name.trim().length === 0 ||
      icon.trim().length === 0 ||
      (stuff === 'statuses' && !color)
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    try {
      await fetchAPI(
        `projects-m/${stuff}${
          openType === 'update' ? `/${existedData?.id}` : ''
        }`,
        {
          method: openType === 'create' ? 'POST' : 'PATCH',
          body: {
            name,
            icon,
            ...(stuff === 'statuses' && { color })
          }
        }
      )

      refreshData()
      setExistedData(null)
      setOpenType(null)
    } catch {
      toast.error(t('input.error.somethingWentWrong'))
    }
  }

  return (
    <FormModal
      data={data}
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      isOpen={openType !== null}
      namespace="modules.projectsM"
      openType={openType}
      setData={setData}
      title={`${_.camelCase(singleStuff)}.${openType}`}
      onClose={() => {
        setOpenType(null)
        setExistedData(null)
      }}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyModal
