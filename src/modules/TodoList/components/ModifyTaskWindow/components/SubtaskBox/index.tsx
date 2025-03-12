import update from 'immutability-helper'
import React, { useCallback, useState } from 'react'

import { APIFallbackComponent } from '@lifeforge/ui'

import { type Loadable } from '@interfaces/common'

import { type ITodoSubtask } from '../../../../interfaces/todo_list_interfaces'
import SubtaskBoxHeader from './components/SubtaskBoxHeader'
import SubtaskItem from './components/SubtaskItem'

function SubtaskBox({
  summary,
  notes,
  subtasks,
  setSubtasks
}: {
  summary: string
  notes: string
  subtasks: Loadable<ITodoSubtask[]>
  setSubtasks: React.Dispatch<React.SetStateAction<Loadable<ITodoSubtask[]>>>
}): React.ReactElement {
  const [spiciness, setSpiciness] = useState(0)
  const [newTask, setNewTask] = useState('')

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setSubtasks((prevCards: Loadable<ITodoSubtask[]>) => {
      if (typeof prevCards === 'string') return prevCards
      return update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]]
        ]
      })
    })
  }, [])

  return (
    <div className="bg-bg-200/50 shadow-custom dark:bg-bg-800/50 mt-4 rounded-md p-[1.4rem]">
      <SubtaskBoxHeader
        notes={notes}
        setNewTask={setNewTask}
        setSpiciness={setSpiciness}
        setSubtasks={setSubtasks}
        spiciness={spiciness}
        summary={summary}
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
                  setSubtasks={setSubtasks}
                  subtask={subtask}
                  subtasks={subtasks}
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
