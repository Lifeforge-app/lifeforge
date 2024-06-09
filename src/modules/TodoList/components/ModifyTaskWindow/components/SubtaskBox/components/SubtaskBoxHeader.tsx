import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { type ITodoSubtask } from '@typedec/TodoList'
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
  setSubtasks: React.Dispatch<
    React.SetStateAction<ITodoSubtask[] | 'loading' | 'error'>
  >
  setNewTask: React.Dispatch<React.SetStateAction<string>>
  summary: string
  notes: string
}): React.ReactElement {
  const [AIGenerateLoading, setAIGenerateLoading] = useState(false)
  async function AIGenerateSubtask(): Promise<void> {
    if (summary === '') {
      toast.error('Task summary cannot be empty.')
      return
    }

    setAIGenerateLoading(true)
    await APIRequest({
      method: 'POST',
      endpoint: 'todo-list/subtask/ai-generate',
      body: {
        summary,
        notes,
        level: spiciness
      },
      successInfo: 'Yay! Subtask generated.',
      failureInfo: 'Oops! Failed to generate subtask. Please try again.',
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
    <div className="flex w-full items-center justify-between gap-6">
      <div className="flex items-center gap-5 text-bg-500">
        <Icon icon="icon-park-outline:right-branch" className="size-6" />
        <h2 className="font-medium">Subtasks</h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            AIGenerateSubtask().catch(console.error)
          }}
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:!text-custom-500 dark:hover:bg-bg-800 dark:hover:!text-custom-500"
        >
          <Icon
            icon={
              AIGenerateLoading ? 'svg-spinners:3-dots-scale' : 'mage:stars-c'
            }
            className="text-2xl"
          />
        </button>
        <SpicinessSelector spiciness={spiciness} setSpiciness={setSpiciness} />
        <button
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
          className="rounded-lg p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100"
        >
          <Icon icon="tabler:plus" className="text-2xl" />
        </button>
      </div>
    </div>
  )
}

export default SubtaskBoxHeader
