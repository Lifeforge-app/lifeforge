import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

import { TodoListProvider } from '@apps/TodoList/providers/TodoListProvider'

import TodoListContainer from './components/TodoListContainer'

function TodoList() {
  return (
    <>
      <ModuleWrapper innerContainerClassName="pl-4! sm:pl-8! sm:pr-8!">
        <div className="pl-4 xl:pl-0">
          <ModuleHeader icon="tabler:list-check" title="Todo List" />
        </div>
        <TodoListProvider>
          <TodoListContainer />
        </TodoListProvider>
      </ModuleWrapper>
    </>
  )
}

export default TodoList
