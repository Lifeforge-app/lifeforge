import { useQuill } from 'react-quilljs'

import { ModuleHeader, ModuleWrapper } from '@lifeforge/ui'

function Blog() {
  const { quillRef } = useQuill({
    placeholder: 'Write your blog post here...'
  })

  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:pencil-heart" title="Blog" />
      <div className="mb-8 flex h-[90%] w-full flex-1 flex-col">
        <div ref={quillRef} className="flex-1" />
      </div>
    </ModuleWrapper>
  )
}

export default Blog
