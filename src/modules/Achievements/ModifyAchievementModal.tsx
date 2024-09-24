/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import COLOR from 'tailwindcss/colors'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import ListboxOption from '@components/ButtonsAndInputs/ListboxInput/components/ListboxOption'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IAchievementEntry } from '@interfaces/achievements_interfaces'
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
  const [loading, setLoading] = useState(false)
  const [achievementTitle, setAchievementTitle] = useState('')
  const [achievementThoughts, setAchievementThoughts] = useState('')
  const [achievementDifficulty, setAchievementDifficulty] = useState('easy')
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  async function onSubmitButtonClick(): Promise<void> {
    if (
      achievementTitle.trim().length === 0 ||
      achievementThoughts.trim().length === 0 ||
      achievementDifficulty.trim().length === 0
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const achievement = {
      title: achievementTitle.trim(),
      thoughts: achievementThoughts.trim(),
      difficulty: achievementDifficulty.trim()
    }

    await APIRequest({
      endpoint:
        'achievements/entries' +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: achievement,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      callback: () => {
        setOpenType(null)
        updateAchievementList()
      },
      onFailure: () => {
        setOpenType(null)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (innerOpenType === 'update' && existedData !== null) {
      setAchievementTitle(existedData.title)
      setAchievementThoughts(existedData.thoughts)
      setAchievementDifficulty(existedData.difficulty)
    } else {
      setAchievementTitle('')
      setAchievementThoughts('')
      setAchievementDifficulty(currentDifficulty)
    }
  }, [innerOpenType, existedData])

  return (
    <>
      <Modal isOpen={openType !== null} minWidth="40vw">
        <ModalHeader
          icon={
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[innerOpenType!]
          }
          title={`${
            {
              create: 'Create ',
              update: 'Update '
            }[innerOpenType!]
          } achievement`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          name="Achievement title"
          icon="tabler:award"
          value={achievementTitle}
          updateValue={setAchievementTitle}
          darker
          placeholder="My achievement"
        />
        <Input
          name="Achievement thoughts"
          icon="tabler:bubble-text"
          value={achievementThoughts}
          updateValue={setAchievementThoughts}
          darker
          placeholder="My thoughts"
          className="mt-4"
        />
        <ListboxInput
          name={t('input.achievementDifficulty')}
          icon="tabler:list"
          value={achievementDifficulty}
          setValue={setAchievementDifficulty}
          buttonContent={
            <>
              {achievementDifficulty !== '' && (
                <span
                  className="h-4 w-1 rounded-full"
                  style={{
                    backgroundColor:
                      COLOR[
                        difficulties.find(
                          l => l[0] === achievementDifficulty
                        )?.[1] as keyof typeof COLOR
                      ][500]
                  }}
                />
              )}
              <span className="-mt-px block truncate">
                {(() => {
                  const diff = difficulties.find(
                    l => l[0] === achievementDifficulty
                  )?.[0]
                  return diff !== undefined
                    ? diff[0].toUpperCase() + diff.slice(1)
                    : 'None'
                })()}
              </span>
            </>
          }
        >
          {difficulties.map(([name, color], i) => (
            <ListboxOption
              key={i}
              text={name[0].toUpperCase() + name.slice(1)}
              color={COLOR[color as keyof typeof COLOR][500]}
              value={name}
            />
          ))}
        </ListboxInput>
        <CreateOrModifyButton
          loading={loading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={innerOpenType}
        />
      </Modal>
    </>
  )
}

export default ModifyAchievementModal
