import { Icon } from '@iconify/react'
import type { Identifier, XYCoord } from 'dnd-core'
import { useEffect, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type ITodoSubtask } from '../../../../../interfaces/todo_list_interfaces'

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
  setSubtasks: React.Dispatch<React.SetStateAction<ITodoSubtask[]>>
  moveTask: (from: number, to: number) => void
  newTask: string
  setNewTask: React.Dispatch<React.SetStateAction<string>>
}) {
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
      className="flex-between bg-bg-100 shadow-custom dark:bg-bg-800 flex cursor-move gap-2 rounded-md p-3"
      data-handler-id={handlerId}
      style={{
        opacity
      }}
    >
      <div className="flex items-center gap-2 w-full">
        <Icon className="text-bg-500 size-5 shrink-0" icon="tabler:menu" />
        {isEditing ? (
          <input
            ref={editInputRef}
            className="bg-transparent w-full"
            type="text"
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
      <HamburgerMenu>
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={() => {
            setIsEditing(true)
            setTimeout(() => {
              editInputRef.current?.focus()
            }, 100)
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={() => {
            setSubtasks(subtasks.filter(task => task.id !== subtask.id))
          }}
        />
      </HamburgerMenu>
    </div>
  )
}

export default SubtaskItem
