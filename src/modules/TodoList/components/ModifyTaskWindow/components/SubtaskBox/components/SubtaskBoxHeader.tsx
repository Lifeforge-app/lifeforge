/* eslint-disable sonarjs/pseudo-random */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { type Loadable } from '@interfaces/common'
import { type ITodoSubtask } from '@interfaces/todo_list_interfaces'
import APIRequest from '@utils/fetchData'
import SpicinessSelector from './SpicinessSelector'

function SubtaskBoxHeader({
  spiciness,
  setSpiciness,
  setSubtasks,
  setNewTask,
  summary,
  notes
}: {
  spiciness: number
  setSpiciness: (spiciness: number) => void
  setSubtasks: React.Dispatch<React.SetStateAction<Loadable<ITodoSubtask[]>>>
  setNewTask: React.Dispatch<React.SetStateAction<string>>
  summary: string
  notes: string
}): React.ReactElement {
  const { t } = useTranslation('modules.todoList')
  const [AIGenerateLoading, setAIGenerateLoading] = useState(false)
  async function AIGenerateSubtask(): Promise<void> {
    if (summary === '') {
      toast.error('Task summary cannot be empty.')
      return
    }

    setAIGenerateLoading(true)
    await APIRequest({
      method: 'POST',
      endpoint: 'todo-list/subtasks/ai-generate',
      body: {
        summary,
        notes,
        level: spiciness
      },
      successInfo: 'generate',
      failureInfo: 'generate',
      callback: data => {
        setAIGenerateLoading(false)
        setSubtasks(
          data.data.map((e: string) => ({
            id: `new-${Math.random()}`,
            title: e
          }))
        )
      },
      finalCallback: () => {
        setAIGenerateLoading(false)
      }
    })
  }

  return (
    <div className="flex-between flex w-full gap-6">
      <div className="flex items-center gap-5 text-bg-500">
        <Icon className="size-6" icon="icon-park-outline:right-branch" />
        <h2 className="font-medium">{t('inputs.subtasks')}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-100 hover:text-custom-500! dark:hover:bg-bg-800 dark:hover:text-custom-500!"
          onClick={() => {
            AIGenerateSubtask().catch(console.error)
          }}
        >
          <Icon
            className="text-2xl"
            icon={
              AIGenerateLoading ? 'svg-spinners:3-dots-scale' : 'mage:stars-c'
            }
          />
        </button>
        <SpicinessSelector setSpiciness={setSpiciness} spiciness={spiciness} />
        <button
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-50"
          onClick={() => {
            setSubtasks(prev => {
              if (typeof prev === 'string') return prev
              const newTaskId = `new-${Math.random()}`
              setNewTask(newTaskId)
              return prev.concat({
                id: newTaskId,
                title: '',
                done: false
              })
            })
          }}
        >
          <Icon className="text-2xl" icon="tabler:plus" />
        </button>
      </div>
    </div>
  )
}

export default SubtaskBoxHeader
