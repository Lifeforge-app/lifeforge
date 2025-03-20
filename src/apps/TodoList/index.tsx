import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

import { TodoListProvider } from '@apps/TodoList/providers/TodoListProvider'

import TodoListContainer from './components/TodoListContainer'

function TodoList() {
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
