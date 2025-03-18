import { useQueryClient } from '@tanstack/react-query'
import update from 'immutability-helper'
import { useCallback, useState } from 'react'

import { APIFallbackComponent } from '@lifeforge/ui'

import { type ITodoSubtask } from '../../../../interfaces/todo_list_interfaces'
import SubtaskBoxHeader from './components/SubtaskBoxHeader'
import SubtaskItem from './components/SubtaskItem'

function SubtaskBox({
  taskId,
  summary,
  notes,
  subtasks
}: {
  taskId: string
  summary: string
  notes: string
  subtasks: ITodoSubtask[]
}) {
  const queryClient = useQueryClient()
  const [spiciness, setSpiciness] = useState(0)
  const [newTask, setNewTask] = useState('')

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    queryClient.setQueryData<ITodoSubtask[]>(
      ['todo-list', 'subtasks', taskId],
      prevCards => {
        if (!prevCards) {
          return []
        }

        return update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]]
          ]
        })
      }
    )
  }, [])

  return (
    <div className="bg-bg-200/50 shadow-custom dark:bg-bg-800/50 mt-4 rounded-md p-[1.4rem]">
      <SubtaskBoxHeader
        notes={notes}
        setNewTask={setNewTask}
        setSpiciness={setSpiciness}
        spiciness={spiciness}
        summary={summary}
        taskId={taskId}
      />
      <APIFallbackComponent data={subtasks}>
        {subtasks =>
          subtasks.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {subtasks.map((subtask, index) => (
                <SubtaskItem
                  key={subtask.id ?? index}
                  moveTask={moveTask}
                  newTask={newTask}
                  setNewTask={setNewTask}
                  subtask={subtask}
                  subtasks={subtasks}
                  taskId={taskId}
                />
              ))}
            </div>
          ) : (
            <></>
          )
        }
      </APIFallbackComponent>
    </div>
  )
}

export default SubtaskBox
