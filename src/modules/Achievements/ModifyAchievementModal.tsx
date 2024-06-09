/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import React, { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import Input from '@components/ButtonsAndInputs/Input'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import { type IAchievementEntry } from '@typedec/Achievements'
import APIRequest from '@utils/fetchData'

const difficulties = [
  ['easy', 'bg-green-500'],
  ['medium', 'bg-yellow-500'],
  ['hard', 'bg-red-500'],
  ['impossible', 'bg-purple-500']
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

  function updateAchievementTitle(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setAchievementTitle(e.target.value)
  }

  function updateAchievementThoughts(
    e: React.ChangeEvent<HTMLInputElement>
  ): void {
    setAchievementThoughts(e.target.value)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (
      achievementTitle.trim().length === 0 ||
      achievementThoughts.trim().length === 0 ||
      achievementDifficulty.trim().length === 0
    ) {
      toast.error('Please fill in all the fields.')
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
        `achievements/entry/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: achievement,
      successInfo: {
        create: 'Yay! Achievement created. Time to fill it up.',
        update: 'Yay! Achievement updated.'
      }[innerOpenType!],
      failureInfo: {
        create: "Oops! Couldn't create the achievement. Please try again.",
        update: "Oops! Couldn't update the achievement. Please try again."
      }[innerOpenType!],
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
          updateValue={updateAchievementTitle}
          darker
          placeholder="My achievement"
        />
        <Input
          name="Achievement thoughts"
          icon="tabler:bubble-text"
          value={achievementThoughts}
          updateValue={updateAchievementThoughts}
          darker
          placeholder="My thoughts"
          additionalClassName="mt-4"
        />
        <Listbox
          value={achievementDifficulty}
          onChange={color => {
            setAchievementDifficulty(color ?? '')
          }}
          as="div"
          className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
        >
          <Listbox.Button className="flex w-full items-center">
            <Icon
              icon="tabler:list"
              className={`ml-6 size-6 shrink-0 ${
                achievementDifficulty !== '' ? '' : 'text-bg-500'
              } group-focus-within:!text-custom-500`}
            />
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-5 -translate-y-1/2 text-[14px]'}`}
            >
              Difficulty
            </span>
            <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none sm:text-sm">
              {achievementDifficulty !== '' && (
                <span
                  className={`h-4 w-1 rounded-full ${
                    difficulties.find(l => l[0] === achievementDifficulty)?.[1]
                  }`}
                />
              )}
              <span className="mt-[-1px] block truncate">
                {(() => {
                  const diff = difficulties.find(
                    l => l[0] === achievementDifficulty
                  )?.[0]
                  return diff !== undefined
                    ? diff[0].toUpperCase() + diff.slice(1)
                    : 'None'
                })()}
              </span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
              <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute bottom-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800 sm:text-sm">
              {difficulties.map(([name, color], i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active
                        ? 'bg-bg-200/50 dark:bg-bg-700/50'
                        : '!bg-transparent'
                    }`
                  }
                  value={name}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className="flex items-center gap-4">
                          <span className={`h-4 w-1 rounded-full ${color}`} />
                          <div className="flex items-center gap-2">
                            {name[0].toUpperCase() + name.slice(1)}
                          </div>
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>

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
