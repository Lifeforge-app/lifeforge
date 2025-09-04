import type { IdeaBoxContainer } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import ContainerItem from './components/ContainerItem'

function ContainerList({ filteredList }: { filteredList: IdeaBoxContainer[] }) {
  return (
    <div className="mt-6 grid w-full grid-cols-[repeat(auto-fill,minmax(18rem,1fr))] gap-6 px-3 pb-12">
      {filteredList.map(container => (
        <ContainerItem key={container.id} container={container} />
      ))}
    </div>
  )
}

export default ContainerList
