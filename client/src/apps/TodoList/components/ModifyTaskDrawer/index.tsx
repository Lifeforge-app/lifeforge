import { Icon } from '@iconify/react'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import dayjs from 'dayjs'
import {
  Button,
  DateInput,
  DeleteConfirmationModal,
  HamburgerMenu,
  MenuItem,
  Scrollbar,
  Switch,
  TextAreaInput,
  TextInput
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import { ITodoListEntry } from '../../interfaces/todo_list_interfaces'
import ListSelector from './components/ListSelector'
import PrioritySelector from './components/PrioritySelector'
import TagsSelector from './components/TagsSelector'

function ModifyTaskDrawer() {
  const open = useModalStore(state => state.open)

  const queryClient = useQueryClient()

  const { t } = useTranslation('apps.todoList')

  const {
    entriesQueryKey,
    modifyTaskWindowOpenType: openType,
    setModifyTaskWindowOpenType: setOpenType,
    selectedTask,
    setSelectedTask
  } = useTodoListContext()

  const [summary, setSummary] = useState('')

  const [notes, setNotes] = useState('')

  const [dueDateHasTime, setDueDateHasTime] = useState(false)

  const [dueDate, setDueDate] = useState<Date | null>(null)

  const [priority, setPriority] = useState<string>('')

  const [list, setList] = useState<string>('')

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
      due_date: dueDate ?? '',
      due_date_has_time: dueDateHasTime,
      priority: priority ?? null,
      list: list ?? '',
      tags
    }

    try {
      const data = await fetchAPI<ITodoListEntry>(
        import.meta.env.VITE_API_HOST,
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

  const handleDeleteTask = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'todo-list/entries',
      data: selectedTask ?? undefined,
      itemName: 'task',
      nameKey: 'summary',
      queryKey: entriesQueryKey,
      customCallback: async () => {
        queryClient.invalidateQueries({
          queryKey: ['todo-list', 'priorities']
        })
        queryClient.invalidateQueries({ queryKey: ['todo-list', 'lists'] })
        queryClient.invalidateQueries({ queryKey: ['todo-list', 'tags'] })
        queryClient.invalidateQueries({
          queryKey: ['todo-list', 'status-counter']
        })
        setOpenType(null)
        setSelectedTask(null)
      }
    })
  }, [selectedTask])

  useEffect(() => {
    setTimeout(() => {
      setInnerOpenType(openType)

      if (summaryInputRef.current) {
        summaryInputRef.current.focus()
      }
    }, 5)
  }, [openType])

  useEffect(() => {
    if (selectedTask !== null) {
      setSummary(selectedTask.summary)
      setNotes(selectedTask.notes)
      setDueDate(
        selectedTask.due_date ? dayjs(selectedTask.due_date).toDate() : null
      )
      setDueDateHasTime(selectedTask.due_date_has_time)
      setPriority(selectedTask.priority)
      setList(selectedTask.list)
      setTags(selectedTask.tags)
    } else {
      setSummary('')
      setNotes('')
      setDueDate(null)
      setDueDateHasTime(false)
      setPriority('')
      setList('')
      setTags([])
    }
  }, [selectedTask, openType])

  return (
    <div
      ref={ref}
      className={clsx(
        'bg-bg-900/20 fixed top-0 left-0 h-dvh w-full backdrop-blur-xs transition-all',
        innerOpenType !== null
          ? 'z-9995 opacity-100 [transition:z-index_0s_linear_0s,opacity_0.1s_linear_0s]'
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
                onClick={handleDeleteTask}
              />
            </HamburgerMenu>
          </div>
          <div className="space-y-4">
            <TextInput
              ref={summaryInputRef}
              darker
              required
              className="w-full"
              icon="tabler:abc"
              name="Summary"
              namespace="apps.todoList"
              placeholder="An urgent task"
              setValue={setSummary}
              value={summary}
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
                      dayjs(dueDate).set('hour', 0).set('minute', 0).toDate()
                    )
                }}
              />
            </div>
            <DateInput
              darker
              date={dueDate}
              hasTime={dueDateHasTime}
              icon="tabler:calendar"
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

export default ModifyTaskDrawer
