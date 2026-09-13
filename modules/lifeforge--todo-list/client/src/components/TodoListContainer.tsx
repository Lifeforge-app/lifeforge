import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'

import {
  Box,
  EmptyStateScreen,
  FAB,
  Flex,
  SearchInput,
  WithQuery,
  toast,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import ModifyTaskModal from '@/modals/ModifyTaskModal'
import {
  type TodoListEntry,
  useTodoListContext
} from '@/providers/TodoListProvider'

import Header from './Header'
import Sidebar from './Sidebar'
import TaskList from './tasks/TaskList'

function TodoListContainer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { open } = useModalStore()

  const {
    entriesQuery,
    modifyTaskWindowOpenType,
    selectedTask,
    setModifyTaskWindowOpenType,
    setSelectedTask
  } = useTodoListContext()

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEntries, setFilteredEntries] = useState<TodoListEntry[]>([])
  const { hash } = useLocation()

  async function fetchAndSetTask(id: string) {
    try {
      const data = await forgeAPI.entries.getById
        .input({
          id
        })
        .query()

      setSelectedTask(data)
      setModifyTaskWindowOpenType('update')
    } catch (error) {
      console.error('Error fetching entry:', error)
      toast.error('Error fetching entry')
    }
  }

  useEffect(() => {
    if (hash === '#new') {
      setSelectedTask(null)
      setModifyTaskWindowOpenType('create')
    }
  }, [hash])

  useEffect(() => {
    const id = searchParams.get('entry')

    if (id) {
      fetchAndSetTask(id)

      const newSearchParams = new URLSearchParams(searchParams)

      newSearchParams.delete('entry')
      setSearchParams(newSearchParams, { replace: true })
    }
  }, [searchParams, entriesQuery.data])

  useEffect(() => {
    if (modifyTaskWindowOpenType === null) return

    if (modifyTaskWindowOpenType === 'update' && !selectedTask) return

    open(ModifyTaskModal, {
      type: modifyTaskWindowOpenType,
      initialData:
        modifyTaskWindowOpenType === 'update' ? selectedTask : undefined
    })

    setModifyTaskWindowOpenType(null)
    setSelectedTask(null)
  }, [modifyTaskWindowOpenType, selectedTask])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEntries(entriesQuery.data ?? [])

      return
    }

    const lowerCaseQuery = searchQuery.toLowerCase()

    const filtered = (entriesQuery.data ?? []).filter(entry =>
      entry.summary.toLowerCase().includes(lowerCaseQuery)
    )

    setFilteredEntries(filtered)
  }, [searchQuery, entriesQuery.data])

  return (
    <>
      <Flex flex="1" height="100%" minHeight="0" width="100%">
        <Sidebar />
        <Flex
          direction="column"
          flex="1"
          height="100%"
          ml={{ base: 'none', xl: 'xl' }}
          position="relative"
          width="100%"
          zIndex="10"
        >
          <Header />
          <Box px="md" width="100%">
            <SearchInput
              debounceMs={300}
              mt="md"
              searchTarget="task"
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </Box>
          <WithQuery query={entriesQuery}>
            {() =>
              filteredEntries.length > 0 ? (
                <TaskList entries={filteredEntries} />
              ) : (
                <EmptyStateScreen
                  icon="tabler:article-off"
                  message={{
                    id: 'tasks'
                  }}
                />
              )
            }
          </WithQuery>
        </Flex>
      </Flex>
      {(entriesQuery.data ?? []).length > 0 && (
        <FAB
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
        />
      )}
    </>
  )
}

export default TodoListContainer
