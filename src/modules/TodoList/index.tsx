/* eslint-disable @typescript-eslint/naming-convention */
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import { TodoListProvider } from '@providers/TodoListProvider'
import TodoListContainer from './components/TodoListContainer'

function TodoList(): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const status = searchParams.get('status')
    if (status === null || status === '') return
    if (
      !['all', 'today', 'scheduled', 'overdue', 'completed'].includes(status)
    ) {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        status: 'all'
      })
    }
  }, [searchParams])

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader
          title="Todo List"
          desc="Human brain is not designed to remember everything."
        />
        <TodoListProvider>
          <TodoListContainer />
        </TodoListProvider>
      </ModuleWrapper>
    </>
  )
}

export default TodoList
