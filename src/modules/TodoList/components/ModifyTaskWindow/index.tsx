import { Icon } from '@iconify/react'
import fetchAPI from '@utils/fetchAPI'
import clsx from 'clsx'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import {
  Button,
  CreateOrModifyButton,
  DateInput,
  HamburgerMenu,
  MenuItem,
  Scrollbar,
  TextInput
} from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import useFetch from '@hooks/useFetch'

import { type ITodoSubtask } from '../../interfaces/todo_list_interfaces'
import ListSelector from './components/ListSelector'
import NotesInput from './components/NotesInput'
import PrioritySelector from './components/PrioritySelector'
import SubtaskBox from './components/SubtaskBox'
import TagsSelector from './components/TagsSelector'

function ModifyTaskWindow(): React.ReactElement {
  const { t } = useTranslation('modules.todoList')
  const {
    modifyTaskWindowOpenType: openType,
    setModifyTaskWindowOpenType: setOpenType,
    selectedTask,
    setSelectedTask,
    refreshEntries,
    refreshTagsList,
    refreshPriorities,
    refreshLists,
    refreshStatusCounter,
    setDeleteTaskConfirmationModalOpen
  } = useTodoListContext()

  const [summary, setSummary] = useState('')
  const [subtasks, , setSubtasks] = useFetch<ITodoSubtask[]>(
    `todo-list/subtasks/list/${selectedTask?.id}`,
    (selectedTask?.subtasks.length ?? 0) > 0 && openType === 'update'
  )

  const [notes, setNotes] = useState('')
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

  async function onSubmitButtonClick(): Promise<void> {
    if (openType === null) return

    if (summary.trim().length === 0) {
      toast.error('Task summary cannot be empty.')
      return
    }

    setLoading(true)

    const task = {
      summary: summary.trim(),
      notes: notes.trim(),
      subtasks,
      due_date: moment(dueDate).format('yyyy-MM-DD 23:59:59Z'),
      priority,
      list,
      tags
    }

    try {
      await fetchAPI(
        'todo-list/entries' +
          (innerOpenType === 'update' ? `/${selectedTask?.id}` : ''),
        {
          method: innerOpenType === 'create' ? 'POST' : 'PATCH',
          body: task
        }
      )

      setOpenType(null)
      setSelectedTask(null)
      refreshEntries()
      refreshTagsList()
      refreshPriorities()
      refreshLists()
      refreshStatusCounter()
    } catch {
      toast.error('Error')
    } finally {
      setLoading(false)
    }
  }

  function updateNotes(event: React.FormEvent<HTMLTextAreaElement>): void {
    setNotes(event.currentTarget.value)
  }

  function closeWindow(): void {
    setInnerOpenType(null)
    setTimeout(() => {
      setOpenType(null)
      setSelectedTask(null)
    }, 300)
  }

  useEffect(() => {
    setTimeout(() => {
      setInnerOpenType(openType)
    }, 5)
  }, [openType])

  useEffect(() => {
    if (selectedTask !== null) {
      setSummary(selectedTask.summary)
      setNotes(selectedTask.notes)
      setDueDate(selectedTask.due_date)
      setPriority(selectedTask.priority)
      setList(selectedTask.list)
      setTags(selectedTask.tags)
    } else {
      setSummary('')
      setNotes('')
      setDueDate('')
      setPriority(null)
      setList(null)
      setTags([])
      setSubtasks([])
    }
  }, [selectedTask, openType])

  return (
    <div
      ref={ref}
      className={clsx(
        'bg-bg-900/20 backdrop-blur-xs fixed left-0 top-0 h-dvh w-full transition-all',
        innerOpenType !== null
          ? 'z-9990 opacity-100 [transition:z-index_0.1s_linear_0.1s,opacity_0.1s_linear_0.2s]'
          : 'z-0 opacity-0 [transition:z-index_0.1s_linear_0.2s,opacity_0.1s_linear_0.1s]'
      )}
    >
      <button
        className="absolute left-0 top-0 size-full"
        onClick={closeWindow}
      />
      <div
        className={clsx(
          'bg-bg-100 dark:bg-bg-900 absolute right-0 top-0 flex size-full flex-col p-8 transition-all duration-300 sm:w-4/5 md:w-3/5 lg:w-2/5',
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
            <HamburgerMenu largerPadding className="relative">
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
              namespace="modules.todoList"
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
            <DateInput
              darker
              date={dueDate}
              icon="tabler:calendar"
              modalRef={ref}
              name="Due date"
              namespace="modules.todoList"
              setDate={setDueDate}
            />
            <PrioritySelector priority={priority} setPriority={setPriority} />
            <ListSelector list={list} setList={setList} />
            <TagsSelector setTags={setTags} tags={tags} />
            <NotesInput notes={notes} updateNotes={updateNotes} />
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
            <CreateOrModifyButton
              className="w-full"
              loading={loading}
              type={innerOpenType}
              onClick={() => {
                onSubmitButtonClick().catch(console.error)
              }}
            />
          </div>
        </Scrollbar>
      </div>
    </div>
  )
}

export default ModifyTaskWindow
