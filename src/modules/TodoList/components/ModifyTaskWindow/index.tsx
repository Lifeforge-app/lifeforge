import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, CreateOrModifyButton } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { DateInput, TextInput } from '@components/inputs'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import { type ITodoSubtask } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'
import APIRequest from '@utils/fetchData'
import ListSelector from './components/ListSelector'
import NotesInput from './components/NotesInput'
import PrioritySelector from './components/PrioritySelector'
import SubtaskBox from './components/SubtaskBox'
import TagsSelector from './components/TagsSelector'

function ModifyTaskWindow(): React.ReactElement {
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

    await APIRequest({
      endpoint:
        'todo-list/entries' +
        (innerOpenType === 'update' ? `/${selectedTask?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: task,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      callback: () => {
        setOpenType(null)
        setSelectedTask(null)
        refreshEntries()
        refreshTagsList()
        refreshPriorities()
        refreshLists()
        refreshStatusCounter()
      },
      onFailure: () => {
        setOpenType(null)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
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
      className={`fixed left-0 top-0 h-dvh w-full bg-bg-900/20 backdrop-blur-xs transition-all ${
        innerOpenType !== null
          ? 'z-9990 opacity-100 [transition:z-index_0.1s_linear_0.1s,opacity_0.1s_linear_0.2s]'
          : 'z-0 opacity-0 [transition:z-index_0.1s_linear_0.2s,opacity_0.1s_linear_0.1s]'
      }`}
    >
      <button
        onClick={closeWindow}
        className="absolute left-0 top-0 size-full"
      />
      <div
        className={`absolute right-0 flex flex-col transition-all duration-300 ${
          innerOpenType !== null ? 'translate-x-0' : 'translate-x-full'
        } top-0 size-full bg-bg-100 p-8 dark:bg-bg-900 sm:w-4/5 md:w-3/5 lg:w-2/5`}
      >
        <Scrollbar>
          <div className="flex-between mb-8 flex ">
            <h1 className="flex items-center gap-3 text-2xl font-semibold">
              <Icon
                icon={
                  {
                    create: 'tabler:plus',
                    update: 'tabler:pencil'
                  }[innerOpenType ?? 'create']
                }
                className="size-7"
              />
              {
                {
                  create: 'Create ',
                  update: 'Modify '
                }[innerOpenType ?? 'create']
              }{' '}
              task
            </h1>
            <HamburgerMenu largerPadding className="relative">
              <MenuItem
                isRed
                icon="tabler:trash"
                onClick={() => {
                  setDeleteTaskConfirmationModalOpen(true)
                  setOpenType(null)
                }}
                text="Delete"
              />
            </HamburgerMenu>
          </div>
          <div className="space-y-4">
            <TextInput
              name="Summary"
              value={summary}
              placeholder="An urgent task"
              icon="tabler:abc"
              darker
              updateValue={setSummary}
              className="w-full"
              ref={summaryInputRef}
              namespace="modules.todoList"
            />
            <SubtaskBox
              summary={summary}
              notes={notes}
              subtasks={subtasks}
              setSubtasks={setSubtasks}
            />
            <DateInput
              modalRef={ref}
              darker
              date={dueDate}
              setDate={setDueDate}
              name="Due date"
              icon="tabler:calendar"
              namespace="modules.todoList"
            />
            <PrioritySelector priority={priority} setPriority={setPriority} />
            <ListSelector list={list} setList={setList} />
            <TagsSelector tags={tags} setTags={setTags} />
            <NotesInput notes={notes} updateNotes={updateNotes} />
          </div>
          <div className="mt-12 flex flex-1 flex-col-reverse items-end gap-2 sm:flex-row">
            <Button
              loading={loading}
              onClick={closeWindow}
              icon={''}
              className="w-full"
              variant="secondary"
            >
              cancel
            </Button>
            <CreateOrModifyButton
              loading={loading}
              onClick={() => {
                onSubmitButtonClick().catch(console.error)
              }}
              type={innerOpenType}
              className="w-full"
            />
          </div>
        </Scrollbar>
      </div>
    </div>
  )
}

export default ModifyTaskWindow
