/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { t } from 'i18next'
import React, { useEffect, useReducer } from 'react'
import { toast } from 'react-toastify'
import COLOR from 'tailwindcss/colors'
import Modal from '@components/Modals/Modal'
import { type IAchievementEntry } from '@interfaces/achievements_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import APIRequest from '@utils/fetchData'

const difficulties = [
  ['easy', 'green'],
  ['medium', 'yellow'],
  ['hard', 'red'],
  ['impossible', 'purple']
]

function ModifyAchievementModal({
  openType,
  setOpenType,
  updateAchievementList,
  existedData,
  currentDifficulty
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateAchievementList: () => void
  existedData: IAchievementEntry | null
  currentDifficulty: string
}): React.ReactElement {
  const [data, setData] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      title: '',
      thoughts: '',
      difficulty: ''
    }
  )

  const FIELDS: IFieldProps[] = [
    {
      id: 'title',
      name: 'Achievement title',
      icon: 'tabler:award',
      placeholder: 'My achievement',
      type: 'text'
    },
    {
      id: 'thoughts',
      name: 'Achievement thoughts',
      icon: 'tabler:bubble-text',
      placeholder: 'My thoughts',
      type: 'text'
    },
    {
      id: 'difficulty',
      name: 'Achievement difficulty',
      icon: 'tabler:list',
      type: 'listbox',
      options: difficulties.map(([name, color]) => ({
        text: name[0].toUpperCase() + name.slice(1),
        value: name,
        color: COLOR[color as keyof typeof COLOR][500]
      }))
    }
  ]

  async function onSubmitButtonClick(): Promise<void> {
    const { title, thoughts, difficulty } = data
    if (
      title.trim().length === 0 ||
      thoughts.trim().length === 0 ||
      difficulty.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    await APIRequest({
      endpoint:
        'achievements/entries' +
        (openType === 'update' ? `/${existedData?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: data,
      successInfo: openType,
      failureInfo: openType,
      callback: () => {
        setOpenType(null)
        updateAchievementList()
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
        title: '',
        thoughts: '',
        difficulty: currentDifficulty
      })
    }
  }, [openType, existedData])

  return (
    <Modal
      title={`${
        {
          create: 'Create ',
          update: 'Update '
        }[openType!]
      } achievement`}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      data={data}
      setData={setData}
      fields={FIELDS}
      openType={openType}
      setOpenType={setOpenType}
      onSubmit={onSubmitButtonClick}
    />
  )
}

export default ModifyAchievementModal
