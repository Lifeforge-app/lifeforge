import React from 'react'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import { TodoListProvider } from '@providers/TodoListProvider'
import TodoListContainer from './components/TodoListContainer'

function TodoList(): React.ReactElement {
  return (
    <>
      <ModuleWrapper>
        <ModuleHeader icon="tabler:list-check" title="Todo List" />
        <TodoListProvider>
          <TodoListContainer />
        </TodoListProvider>
      </ModuleWrapper>
    </>
  )
}

export default TodoList
