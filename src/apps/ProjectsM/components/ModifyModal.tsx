import _ from 'lodash'
import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { useProjectsMContext } from '../providers/ProjectsMProvider'

function ModifyModal({
  stuff
}: {
  stuff: 'categories' | 'technologies' | 'visibilities' | 'statuses'
}) {
  const {
    modifyDataModalOpenType: openType,
    setModifyDataModalOpenType: setOpenType,
    existedData,
    setExistedData
  } = useProjectsMContext()[stuff]

  const singleStuff = {
    categories: 'category',
    technologies: 'technology',
    visibilities: 'visibility',
    statuses: 'status'
  }[stuff]
  const [data, setData] = useState({
    name: '',
    icon: '',
    ...(stuff === 'statuses' && { color: '' })
  })
  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      required: true,
      label: `${singleStuff} name`,
      icon: 'tabler:book',
      placeholder: `Project ${singleStuff}`,
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: `${singleStuff} icon`,
      type: 'icon'
    },
    ...(stuff === 'statuses'
      ? [
          {
            required: true,
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

  return (
    <FormModal
      data={data}
      endpoint={`projects-m/${stuff}`}
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="apps.projectsM"
      openType={openType}
      queryKey={['projects-m', stuff]}
      setData={setData}
      title={`${_.camelCase(singleStuff)}.${openType}`}
      onClose={() => {
        setOpenType(null)
        setExistedData(null)
      }}
    />
  )
}

export default ModifyModal
