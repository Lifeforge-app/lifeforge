/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { Icon } from '@iconify/react'
import type { Identifier, XYCoord } from 'dnd-core'
import React, { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import { type ITodoSubtask } from '@interfaces/todo_list_interfaces'

function SubtaskItem({
  subtask,
  subtasks,
  setSubtasks,
  moveTask,
  newTask,
  setNewTask
}: {
  subtask: ITodoSubtask
  subtasks: ITodoSubtask[]
  setSubtasks: React.Dispatch<
    React.SetStateAction<ITodoSubtask[] | 'loading' | 'error'>
  >
  moveTask: (from: number, to: number) => void
  newTask: string
  setNewTask: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (newTask === subtask.id) {
      setIsEditing(true)
      setTimeout(() => {
        editInputRef.current?.focus()
      }, 100)

      setNewTask('')
    }
  }, [newTask, subtask.id])

  const [{ handlerId }, drop] = useDrop<
    ITodoSubtask,
    void,
    { handlerId: Identifier | null }
  >({
    accept: 'SUBTASK',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: ITodoSubtask & { index?: number }, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = subtasks.indexOf(subtask)

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex !== undefined) {
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return
        }

        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return
        }

        moveTask(dragIndex, hoverIndex)
      }

      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'SUBTASK',
    item: () => {
      return {
        ...subtask,
        index: subtasks.indexOf(subtask)
      }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{
        opacity
      }}
      data-handler-id={handlerId}
      className="flex cursor-move items-center justify-between gap-2 rounded-md bg-bg-100 p-3 shadow-custom dark:bg-bg-800"
    >
      <div className="flex items-center gap-2">
        <Icon icon="tabler:menu" className="size-5 shrink-0 text-bg-500" />
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            className="bg-transparent"
            value={subtask.title}
            onBlur={e => {
              setIsEditing(false)
              if (e.target.value === '') {
                setSubtasks(subtasks.filter(task => task.id !== subtask.id))
              }
            }}
            onChange={e => {
              setSubtasks(
                subtasks.map(task =>
                  task.id === subtask.id
                    ? {
                        ...task,
                        title: e.target.value,
                        hasChanged: true
                      }
                    : task
                )
              )
            }}
          />
        ) : (
          <span>{subtask.title}</span>
        )}
      </div>
      <HamburgerMenu className="relative">
        <MenuItem
          icon="tabler:edit"
          text="Edit"
          preventDefault={false}
          onClick={() => {
            setIsEditing(true)
            setTimeout(() => {
              editInputRef.current?.focus()
            }, 100)
          }}
        />
        <MenuItem
          icon="tabler:trash"
          text="Delete"
          isRed
          onClick={() => {
            setSubtasks(subtasks.filter(task => task.id !== subtask.id))
          }}
        />
      </HamburgerMenu>
    </div>
  )
}

export default SubtaskItem
