/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import DateInput from '@components/ButtonsAndInputs/DateInput'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import Input from '@components/ButtonsAndInputs/Input'
import useFetch from '@hooks/useFetch'
import { useTodoListContext } from '@providers/TodoListProvider'
import { type ITodoSubtask } from '@typedec/TodoList'
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
    refreshLists,
    refreshStatusCounter,
    setDeleteTaskConfirmationModalOpen
  } = useTodoListContext()

  const [summary, setSummary] = useState('')
  console.log(selectedTask?.subtasks)
  const [subtasks, , setSubtasks] = useFetch<ITodoSubtask[]>(
    `todo-list/subtask/list/${selectedTask?.id}`,
    (selectedTask?.subtasks.length ?? 0) > 0 && openType === 'update'
  )

  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('low')
  const [list, setList] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [innerOpenType, setInnerOpenType] = useState<
    'create' | 'update' | null
  >(openType)
  const [loading, setLoading] = useState(false)
  const summaryInputRef = useRef<HTMLInputElement>(null)

  async function onSubmitButtonClick(): Promise<void> {
    if (openType === null) return

    if (summary.trim().length === 0) {
      toast.error('Task summary cannot be empty.')
      return
    }

    setLoading(true)
    console.log(subtasks)

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
        `todo-list/entry/${innerOpenType}` +
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

  function updateSummary(event: React.ChangeEvent<HTMLInputElement>): void {
    setSummary(event.target.value)
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
      setPriority('low')
      setList(null)
      setTags([])
      setSubtasks([])
    }
  }, [selectedTask, openType])

  return (
    <div
      className={`fixed left-0 top-0 h-dvh w-full bg-bg-900/20 backdrop-blur-sm transition-all ${
        innerOpenType !== null
          ? 'z-[9999] opacity-100'
          : ' z-[-9999]  opacity-0 [transition:z-index_0.1s_linear_0.5s,opacity_0.1s_linear_0.1s]'
      }`}
    >
      <button
        onClick={closeWindow}
        className="absolute left-0 top-0 size-full"
      />
      <div
        className={`absolute right-0 flex flex-col overflow-y-scroll transition-all duration-300 ${
          innerOpenType !== null ? 'translate-x-0' : 'translate-x-full'
        } top-0 size-full bg-bg-100 p-8 dark:bg-bg-900 sm:w-4/5 md:w-3/5 lg:w-2/5`}
      >
        <div className="mb-8 flex items-center justify-between ">
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
        <Input
          name="Summary"
          value={summary}
          placeholder="An urgent task"
          icon="tabler:abc"
          darker
          updateValue={updateSummary}
          additionalClassName="w-full"
          reference={summaryInputRef}
        />
        <SubtaskBox
          summary={summary}
          notes={notes}
          subtasks={subtasks}
          setSubtasks={setSubtasks}
        />
        <DateInput
          date={dueDate}
          setDate={setDueDate}
          name="Due date"
          icon="tabler:calendar"
        />
        <PrioritySelector priority={priority} setPriority={setPriority} />
        <ListSelector list={list} setList={setList} />
        <TagsSelector tags={tags} setTags={setTags} />
        <NotesInput notes={notes} updateNotes={updateNotes} />
        <div className="mt-12 flex flex-1 flex-col-reverse items-end gap-2 sm:flex-row">
          <Button
            disabled={loading}
            onClick={closeWindow}
            icon={''}
            className="w-full"
            type="secondary"
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
      </div>
    </div>
  )
}

export default ModifyTaskWindow
