import update from 'immutability-helper'
import React, { useCallback, useState } from 'react'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import { type ITodoSubtask } from '@interfaces/todo_list_interfaces'
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
  subtasks: ITodoSubtask[] | 'loading' | 'error'
  setSubtasks: React.Dispatch<
    React.SetStateAction<ITodoSubtask[] | 'loading' | 'error'>
  >
}): React.ReactElement {
  const [spiciness, setSpiciness] = useState(0)
  const [newTask, setNewTask] = useState('')

  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setSubtasks((prevCards: ITodoSubtask[] | 'loading' | 'error') => {
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
    <div className="mt-4 rounded-md bg-bg-200/50 p-[1.4rem] shadow-custom dark:bg-bg-800/50">
      <SubtaskBoxHeader
        spiciness={spiciness}
        setSpiciness={setSpiciness}
        setSubtasks={setSubtasks}
        setNewTask={setNewTask}
        summary={summary}
        notes={notes}
      />
      <APIFallbackComponent data={subtasks}>
        {subtasks =>
          subtasks.length > 0 ? (
            <div className="mt-4 grid gap-2">
              {subtasks.map((subtask, index) => (
                <SubtaskItem
                  key={subtask.id ?? index}
                  subtask={subtask}
                  subtasks={subtasks}
                  setSubtasks={setSubtasks}
                  moveTask={moveTask}
                  newTask={newTask}
                  setNewTask={setNewTask}
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
