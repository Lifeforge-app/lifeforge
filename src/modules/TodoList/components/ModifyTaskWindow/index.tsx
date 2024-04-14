/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/CreateOrModifyButton'
import HamburgerMenu from '@components/HamburgerMenu'
import MenuItem from '@components/HamburgerMenu/MenuItem'
import Input from '@components/Input'
import ListSelector from './components/ListSelector'
import PrioritySelector from './components/PrioritySelector'
import TagsSelector from './components/TagsSelector'
import {
  type ITodoListList,
  type ITodoListTag,
  type ITodoListEntryItem
} from '../../../../types/TodoList'

function ModifyTaskWindow({
  openType,
  setOpenType,
  lists,
  tagsList,
  selectedTask,
  setSelectedTask,
  refreshEntries,
  refreshTagsList,
  refreshLists,
  setDeleteTaskConfirmationModalOpen
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  lists: ITodoListList[]
  tagsList: ITodoListTag[]
  selectedTask: ITodoListEntryItem | null
  setSelectedTask: React.Dispatch<
    React.SetStateAction<ITodoListEntryItem | null>
  >
  refreshEntries: () => void
  refreshTagsList: () => void
  refreshLists: () => void
  setDeleteTaskConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  const [summary, setSummary] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('low')
  const [list, setList] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [innerOpenType, setInnerOpenType] = useState(openType)
  const [loading, setLoading] = useState(false)
  const summaryInputRef = useRef<HTMLInputElement>(null)

  function onSubmitButtonClick(): void {
    if (summary.trim().length === 0) {
      toast.error('Task summary cannot be empty.')
      return
    }

    setLoading(true)

    const task = {
      summary: summary.trim(),
      notes: notes.trim(),
      due_date: dueDate.trim(),
      priority,
      list,
      tags
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/todo-list/entry/${openType}${
        openType === 'update' ? `/${selectedTask?.id}` : ''
      }`,
      {
        method: openType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(task)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Task created. Time to start working on it.',
            update: 'Yay! Task updated.'
          }[openType!]
        )
        setOpenType(null)
        refreshEntries()
        refreshTagsList()
        refreshLists()
      })
      .catch(err => {
        toast.error(`Oops! Couldn't ${openType} the task. Please try again.`)
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function updateSummary(event: React.ChangeEvent<HTMLInputElement>): void {
    setSummary(event.target.value)
  }

  function updateNotes(event: React.FormEvent<HTMLTextAreaElement>): void {
    setNotes(event.currentTarget.value)
  }

  function updateDueDate(event: React.ChangeEvent<HTMLInputElement>): void {
    setDueDate(event.target.value)
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
    }, 100)
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
    }
  }, [selectedTask, openType])

  return openType !== null ? (
    <div
      className={`fixed left-0 top-0 z-[9999] h-[100dvh] w-full bg-bg-900/20 backdrop-blur-sm transition-all ${
        innerOpenType !== null
          ? 'opacity-100'
          : ' opacity-0 [transition:z-index_0.1s_linear_0.5s,opacity_0.1s_linear_0.1s]'
      }`}
    >
      <button
        onClick={closeWindow}
        className="absolute left-0 top-0 h-full w-full"
      />
      <div
        className={`absolute right-0 flex flex-col overflow-y-scroll transition-all duration-300 ${
          innerOpenType !== null ? 'translate-x-0' : 'translate-x-full'
        } top-0 h-full w-full bg-bg-100 p-8 dark:bg-bg-900 sm:w-4/5 md:w-3/5 lg:w-2/5`}
      >
        <div className="mb-8 flex items-center justify-between ">
          <h1 className="flex items-center gap-3 text-2xl font-semibold">
            <Icon
              icon={
                {
                  create: 'tabler:plus',
                  update: 'tabler:pencil'
                }[innerOpenType!]
              }
              className="h-7 w-7"
            />
            {
              {
                create: 'Create ',
                update: 'Modify '
              }[innerOpenType!]
            }{' '}
            task
          </h1>
          <HamburgerMenu largerPadding position="relative">
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
          autoFocus
        />
        <div
          onFocus={e => {
            ;(
              e.currentTarget.querySelector(
                'textarea input'
              ) as HTMLInputElement
            )?.focus()
          }}
          className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 focus-within:!border-custom-500 dark:bg-bg-800/50"
        >
          <Icon
            icon="tabler:file-text"
            className="ml-6 h-6 w-6 shrink-0 text-bg-500 group-focus-within:!text-custom-500"
          />
          <div className="flex w-full items-center gap-2">
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 transition-all group-focus-within:!text-custom-500 ${
                notes.length === 0
                  ? 'top-1/2 -translate-y-1/2 group-focus-within:top-6 group-focus-within:text-[14px]'
                  : 'top-6 -translate-y-1/2 text-[14px]'
              }
          `}
            >
              Notes
            </span>
            <textarea
              value={notes}
              onInput={e => {
                e.currentTarget.style.height = 'auto'
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + 'px'
                updateNotes(e)
              }}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
              className="mt-4 min-h-[2rem] w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide outline-none placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
            />
          </div>
        </div>
        <Input
          name="Due date"
          value={dueDate}
          placeholder="7/8/2087"
          icon="tabler:calendar"
          darker
          updateValue={updateDueDate}
          additionalClassName="w-full mt-4"
        />
        <PrioritySelector priority={priority} setPriority={setPriority} />
        <ListSelector lists={lists} list={list} setList={setList} />
        <TagsSelector tagsList={tagsList} tags={tags} setTags={setTags} />
        <div className="mt-12 flex flex-1 flex-col-reverse items-end gap-2 sm:flex-row">
          <button
            disabled={loading}
            onClick={closeWindow}
            className="flex h-16 w-full items-center justify-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50"
          >
            cancel
          </button>
          <CreateOrModifyButton
            loading={loading}
            onClick={onSubmitButtonClick}
            type={innerOpenType}
          />
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default ModifyTaskWindow
