/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
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
