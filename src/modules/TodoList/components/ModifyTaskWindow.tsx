/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { Fragment, useEffect, useState } from 'react'
import Input from '../../../components/general/Input'
import { Listbox, Transition } from '@headlessui/react'
import { type ITodoListTag, type ITodoListList } from './Sidebar'

const PRIORITIES = [
  {
    name: 'Low',
    color: 'text-green-500'
  },
  {
    name: 'Medium',
    color: 'text-yellow-500'
  },
  {
    name: 'High',
    color: 'text-red-500'
  }
]

function ModifyTaskWindow({
  isOpen,
  setIsOpen,
  lists,
  tagsList
}: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  lists: ITodoListList[]
  tagsList: ITodoListTag[]
}): React.ReactElement {
  const [summary, setSummary] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('low')
  const [list, setList] = useState<string | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [innerIsOpen, setInnerIsOpen] = useState(isOpen)
  const [tagsSelectorOpen, setTagsSelectorOpen] = useState(false)

  function updateSummary(event: React.ChangeEvent<HTMLInputElement>): void {
    setSummary(event.target.value)
  }

  function updateNotes(event: React.FormEvent<HTMLTextAreaElement>): void {
    setNotes(event.currentTarget.value)
  }

  function updateDueDate(event: React.ChangeEvent<HTMLInputElement>): void {
    setDueDate(event.target.value)
  }

  useEffect(() => {
    setTimeout(() => {
      setInnerIsOpen(isOpen)
    }, 100)
  }, [isOpen])

  useEffect(() => {
    function hideTagsSelector(event: MouseEvent): void {
      if (
        !(event.target as HTMLElement).closest('.group') &&
        !(event.target as HTMLElement).closest('.group')
      ) {
        setTagsSelectorOpen(false)
      }
    }

    window.addEventListener('click', hideTagsSelector)

    return () => {
      window.removeEventListener('click', hideTagsSelector)
    }
  }, [])

  return isOpen ? (
    <div
      className={`fixed left-0 top-0 z-[9999] h-[100dvh] w-full bg-bg-900/20 backdrop-blur-sm transition-all ${
        innerIsOpen
          ? 'opacity-100'
          : ' opacity-0 [transition:z-index_0.1s_linear_0.5s,opacity_0.1s_linear_0.1s]'
      }`}
    >
      <button
        onClick={() => {
          setInnerIsOpen(false)
          setTimeout(() => {
            setIsOpen(false)
          }, 300)
        }}
        className="absolute left-0 top-0 h-full w-full"
      />
      <div
        className={`absolute right-0 overflow-y-scroll transition-all duration-300 ${
          innerIsOpen ? 'translate-x-0' : 'translate-x-full'
        } top-0 h-full w-[90%] bg-bg-100 p-8 dark:bg-bg-900 sm:w-4/5 md:w-3/5 lg:w-2/5`}
      >
        <div className="mb-8 flex items-center justify-between ">
          <h1 className="flex items-center gap-3 text-2xl font-semibold">
            <Icon icon={'tabler:pencil'} className="h-7 w-7" />
            Modify task
          </h1>
          <button
            onClick={() => {
              setInnerIsOpen(false)
              setTimeout(() => {
                setIsOpen(false)
              }, 300)
            }}
            className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
          >
            <Icon icon="tabler:x" className="h-6 w-6" />
          </button>
        </div>
        <Input
          name="Summary"
          value={summary}
          placeholder="An urgent task"
          icon="tabler:abc"
          darker
          updateValue={updateSummary}
          additionalClassName="w-full"
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
              className="mt-6 min-h-[2rem] w-full resize-none rounded-lg bg-transparent p-6 pl-4 tracking-wide outline-none placeholder:text-transparent focus:outline-none focus:placeholder:text-bg-500"
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
        <Listbox
          value={priority}
          onChange={color => {
            setPriority(color)
          }}
          as="div"
          className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] focus-within:border-custom-500 dark:bg-bg-900"
        >
          <Listbox.Button className="flex w-full items-center">
            <Icon
              icon="tabler:alert-triangle"
              className={`ml-6 h-6 w-6 shrink-0 ${'text-bg-900 dark:text-bg-100'} group-focus-within:text-custom-500`}
            />
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
            >
              Priority
            </span>
            <div className="relative mb-2 mt-9 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none dark:bg-bg-900 sm:text-sm">
              <span
                className={`text-center font-semibold ${
                  PRIORITIES.find(e => e.name.toLowerCase() === priority)?.color
                }`}
              >
                {'!'.repeat(
                  PRIORITIES.findIndex(e => e.name.toLowerCase() === priority) +
                    1
                )}
              </span>
              <span className="mt-[-1px] block truncate">
                {priority[0].toUpperCase() + priority.slice(1)}
              </span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
              <Icon
                icon="tabler:chevron-down"
                className="h-5 w-5 text-bg-400"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute top-[4.5rem] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-900 sm:text-sm">
              {PRIORITIES.map(({ name, color }, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active ? 'bg-bg-200/50 dark:bg-bg-800' : '!bg-transparent'
                    }`
                  }
                  value={name.toLowerCase()}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className="flex items-center gap-2">
                          <span
                            className={`mr-2 text-center font-semibold ${color}`}
                          >
                            {'!'.repeat(i + 1)}
                          </span>
                          {name}
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
        <Listbox
          value={list}
          onChange={color => {
            setList(color)
          }}
          as="div"
          className="group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] focus-within:border-custom-500 dark:bg-bg-900"
        >
          <Listbox.Button className="flex w-full items-center">
            <Icon
              icon="tabler:list"
              className={`ml-6 h-6 w-6 shrink-0 ${
                list ? 'text-bg-900 dark:text-bg-100' : 'text-bg-500'
              } group-focus-within:text-custom-500`}
            />
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
            >
              List
            </span>
            <div className="relative mb-2 mt-9 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none dark:bg-bg-900 sm:text-sm">
              <span
                className="h-3 w-3 rounded-full border border-bg-300"
                style={{
                  backgroundColor: lists.find(l => l.id === list)?.color
                }}
              />
              <span className="mt-[-1px] block truncate">
                {lists.find(l => l.id === list)?.name ?? 'None'}
              </span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
              <Icon
                icon="tabler:chevron-down"
                className="h-5 w-5 text-bg-400"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute bottom-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-900 sm:text-sm">
              <Listbox.Option
                key={'none'}
                className={({ active }) =>
                  `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                    active ? 'bg-bg-200/50 dark:bg-bg-800' : '!bg-transparent'
                  }`
                }
                value={null}
              >
                {({ selected }) => (
                  <>
                    <div>
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full border border-bg-300" />
                        None
                      </span>
                    </div>
                    {selected && (
                      <Icon
                        icon="tabler:check"
                        className="block text-lg text-custom-500"
                      />
                    )}
                  </>
                )}
              </Listbox.Option>
              {lists.map(({ name, color, id }, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                      active ? 'bg-bg-200/50 dark:bg-bg-800' : '!bg-transparent'
                    }`
                  }
                  value={id}
                >
                  {({ selected }) => (
                    <>
                      <div>
                        <span className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full border border-bg-300"
                            style={{
                              backgroundColor: color
                            }}
                          />
                          {name}
                        </span>
                      </div>
                      {selected && (
                        <Icon
                          icon="tabler:check"
                          className="block text-lg text-custom-500"
                        />
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
        <Listbox
          value={tags}
          multiple
          onChange={color => {
            setTags(color)
          }}
        >
          {({ open }) => (
            <div
              className={`group relative mt-6 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] ${
                open && '!border-custom-500 '
              } dark:bg-bg-900`}
            >
              <Listbox.Button className="flex w-full items-center">
                <Icon
                  icon="tabler:tags"
                  className={`ml-6 h-6 w-6 shrink-0 ${
                    tags.length > 0
                      ? 'text-bg-900 dark:text-bg-100'
                      : 'text-bg-500'
                  } group-focus-within:text-custom-500`}
                />
                <span
                  className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
                >
                  Tags
                </span>
                <div className="relative mb-2 mt-9 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none dark:bg-bg-900 sm:text-sm">
                  <span className="mt-[-1px] block">
                    {tags.length > 0
                      ? tags
                          .map(
                            tag => `#${tagsList.find(t => t.id === tag)?.name}`
                          )
                          .join(', ')
                      : 'None'}
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
                  <Icon
                    icon="tabler:chevron-down"
                    className="h-5 w-5 text-bg-400"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="transition ease-in duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute bottom-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-900 sm:text-sm">
                  {tagsList.map(({ name, id }, i) => (
                    <Listbox.Option
                      key={i}
                      className={({ active }) =>
                        `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                          active
                            ? 'bg-bg-200/50 dark:bg-bg-800'
                            : '!bg-transparent'
                        }`
                      }
                      value={id}
                    >
                      {({ selected }) => (
                        <>
                          <div>
                            <span className="flex items-center gap-2">
                              <Icon icon="tabler:hash" className="h-5 w-5" />
                              {name}
                            </span>
                          </div>
                          {selected && (
                            <Icon
                              icon="tabler:check"
                              className="block text-lg text-custom-500"
                            />
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default ModifyTaskWindow
