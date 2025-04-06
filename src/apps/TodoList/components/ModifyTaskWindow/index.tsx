import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  DateInput,
  HamburgerMenu,
  MenuItem,
  Scrollbar,
  Switch,
  TextAreaInput,
  TextInput
} from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import {
  ITodoListEntry,
  type ITodoSubtask
} from '../../interfaces/todo_list_interfaces'
import ListSelector from './components/ListSelector'
import PrioritySelector from './components/PrioritySelector'
import SubtaskBox from './components/SubtaskBox'
import TagsSelector from './components/TagsSelector'

function ModifyTaskWindow() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.todoList')
  const {
    entriesQueryKey,
    modifyTaskWindowOpenType: openType,
    setModifyTaskWindowOpenType: setOpenType,
    selectedTask,
    setSelectedTask,
    setDeleteTaskConfirmationModalOpen
  } = useTodoListContext()

  const [summary, setSummary] = useState('')
  const [subtasks, setSubtasks] = useState<ITodoSubtask[]>([])
  const subTasksQuery = useAPIQuery<ITodoSubtask[]>(
    `todo-list/subtasks/list/${selectedTask?.id}`,
    ['todo-list', 'subtasks', selectedTask?.id],
    (selectedTask?.subtasks.length ?? 0) > 0 && openType === 'update'
  )

  const [notes, setNotes] = useState('')
  const [dueDateHasTime, setDueDateHasTime] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<string | null>(null)
  const [list, setList] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [innerOpenType, setInnerOpenType] = useState<
    'create' | 'update' | null
  >(openType)
  const [loading, setLoading] = useState(false)
  const summaryInputRef = useRef<HTMLInputElement>(null)
  const ref = useRef<HTMLInputElement>(null)

  async function onSubmitButtonClick() {
    if (openType === null) return

    if (summary.trim().length === 0) {
      toast.error('Task summary cannot be empty.')
      return
    }

    setLoading(true)

    const task = {
      summary: summary.trim(),
      notes: notes.trim(),
      subtasks: subtasks,
      due_date: dueDate,
      due_date_has_time: dueDateHasTime,
      priority: priority ?? null,
      list: list ?? '',
      tags
    }

    try {
      const data = await fetchAPI<ITodoListEntry>(
        'todo-list/entries' +
          (innerOpenType === 'update' ? `/${selectedTask?.id}` : ''),
        {
          method: innerOpenType === 'create' ? 'POST' : 'PATCH',
          body: task
        }
      )

      setOpenType(null)
      setSelectedTask(null)

      queryClient.setQueryData<ITodoListEntry[]>(entriesQueryKey, entries => {
        if (!entries) return []

        console.log(data)

        if (innerOpenType === 'create') {
          return [data, ...entries]
        }

        return entries.map(entry => {
          if (entry.id === data.id) {
            return data
          }

          return entry
        })
      })

      queryClient.invalidateQueries({
        queryKey: ['todo-list', 'status-counter']
      })
      queryClient.invalidateQueries({ queryKey: ['todo-list', 'tags'] })
      queryClient.invalidateQueries({ queryKey: ['todo-list', 'priorities'] })
      queryClient.invalidateQueries({ queryKey: ['todo-list', 'lists'] })
    } catch {
      toast.error('Error')
    } finally {
      setLoading(false)
    }
  }

  function closeWindow() {
    setInnerOpenType(null)
    setTimeout(() => {
      setOpenType(null)
      setSelectedTask(null)
    }, 300)
  }

  useEffect(() => {
    setTimeout(() => {
      setInnerOpenType(openType)
      if (summaryInputRef.current) {
        summaryInputRef.current.focus()
      }
    }, 5)
  }, [openType])

  useEffect(() => {
    if (subTasksQuery.data && !subTasksQuery.isLoading) {
      setSubtasks(subTasksQuery.data)
    }
  }, [subTasksQuery.data, subTasksQuery.isLoading])

  useEffect(() => {
    if (selectedTask !== null) {
      setSummary(selectedTask.summary)
      setNotes(selectedTask.notes)
      setDueDate(selectedTask.due_date)
      setDueDateHasTime(selectedTask.due_date_has_time)
      setPriority(selectedTask.priority)
      setList(selectedTask.list)
      setTags(selectedTask.tags)
    } else {
      setSummary('')
      setNotes('')
      setDueDate('')
      setDueDateHasTime(false)
      setPriority(null)
      setList(null)
      setTags([])
    }
  }, [selectedTask, openType])

  return (
    <div
      ref={ref}
      className={clsx(
        'bg-bg-900/20 fixed top-0 left-0 h-dvh w-full backdrop-blur-xs transition-all',
        innerOpenType !== null
          ? 'z-9990 opacity-100 [transition:z-index_0s_linear_0s,opacity_0.1s_linear_0s]'
          : 'z-[-1] opacity-0 [transition:z-index_0.1s_linear_0.2s,opacity_0.1s_linear_0.1s]'
      )}
    >
      <button
        className="absolute top-0 left-0 size-full"
        onClick={closeWindow}
      />
      <div
        className={clsx(
          'bg-bg-100 dark:bg-bg-900 absolute top-0 right-0 flex size-full flex-col p-8 transition-all duration-300 sm:w-4/5 md:w-3/5 lg:w-2/5',
          innerOpenType !== null && 'translate-x-0',
          innerOpenType === null && 'translate-x-full'
        )}
      >
        <Scrollbar>
          <div className="flex-between mb-8 flex">
            <h1 className="flex items-center gap-3 text-2xl font-semibold">
              <Icon
                className="size-7"
                icon={
                  {
                    create: 'tabler:plus',
                    update: 'tabler:pencil'
                  }[innerOpenType ?? 'create']
                }
              />
              {t(`modals.tasks.${innerOpenType ?? 'create'}`)}
            </h1>
            <HamburgerMenu>
              <MenuItem
                isRed
                icon="tabler:trash"
                text="Delete"
                onClick={() => {
                  setDeleteTaskConfirmationModalOpen(true)
                  setOpenType(null)
                }}
              />
            </HamburgerMenu>
          </div>
          <div className="space-y-4">
            <TextInput
              ref={summaryInputRef}
              darker
              className="w-full"
              icon="tabler:abc"
              name="Summary"
              namespace="apps.todoList"
              placeholder="An urgent task"
              setValue={setSummary}
              value={summary}
            />
            <SubtaskBox
              notes={notes}
              setSubtasks={setSubtasks}
              subtasks={subtasks}
              summary={summary}
            />
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Icon className="size-6" icon="tabler:clock" />
                <span className="text-lg">{t('inputs.hasTime')}</span>
              </div>
              <Switch
                checked={dueDateHasTime}
                onChange={() => {
                  setDueDateHasTime(!dueDateHasTime)
                  if (dueDate)
                    setDueDate(
                      dayjs(dueDate).format(
                        dueDateHasTime ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
                      )
                    )
                }}
              />
            </div>
            <DateInput
              darker
              date={dueDate}
              hasTime={dueDateHasTime}
              icon="tabler:calendar"
              modalRef={ref}
              name="Due date"
              namespace="apps.todoList"
              setDate={setDueDate}
            />
            <PrioritySelector priority={priority} setPriority={setPriority} />
            <ListSelector list={list} setList={setList} />
            <TagsSelector setTags={setTags} tags={tags} />
            <TextAreaInput
              darker
              icon="tabler:pencil"
              name="Notes"
              namespace="apps.todoList"
              placeholder="Add notes here..."
              setValue={setNotes}
              value={notes}
            />
          </div>
          <div className="mt-12 flex flex-1 flex-col-reverse items-end gap-2 sm:flex-row">
            <Button
              className="w-full"
              icon={''}
              loading={loading}
              variant="secondary"
              onClick={closeWindow}
            >
              cancel
            </Button>
            <Button
              className="w-full"
              icon={
                innerOpenType === 'update' ? 'tabler:pencil' : 'tabler:plus'
              }
              loading={loading}
              onClick={() => {
                onSubmitButtonClick().catch(console.error)
              }}
            >
              {innerOpenType === 'update' ? 'Update' : 'Create'}
            </Button>
          </div>
        </Scrollbar>
      </div>
    </div>
  )
}

export default ModifyTaskWindow
