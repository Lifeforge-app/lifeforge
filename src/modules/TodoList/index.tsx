import React from 'react'

import { ModuleWrapper , ModuleHeader } from '@lifeforge/ui'

import { TodoListProvider } from '@modules/TodoList/providers/TodoListProvider'

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
