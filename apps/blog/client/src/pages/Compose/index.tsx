import {
  ContentWrapperWithSidebar,
  GoBackButton,
  LayoutWithSidebar
} from 'lifeforge-ui'
import { useState } from 'react'
import { useQuill } from 'react-quilljs'
import { useNavigate } from 'react-router'

import Sidebar from './components/Sidebar'

function Compose() {
  const navigate = useNavigate()

  const { quillRef } = useQuill({
    placeholder: 'Write your blog post here...',
    formats: ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: [1, 2, 3, false] }],
        ['blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image']
      ]
    }
  })

  const [blogPost, setBlogPost] = useState({
    title: '',
    excerpt: '',
    visibility: 'private',
    featuredImage: null,
    featuredImagePreview: null,
    category: null,
    labels: [] as string[]
  })

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <>
      <LayoutWithSidebar>
        <ContentWrapperWithSidebar>
          <GoBackButton onClick={() => navigate('/blog')} />
          <div className="mt-4 mb-6 flex w-full min-w-0 items-center gap-2">
            <h1 className="placeholder-bg-500 flex w-full items-center gap-2 text-4xl font-medium">
              {blogPost.title || 'Untitled Post'}
            </h1>
          </div>
          <div className="mb-8 flex h-[90%] w-full flex-1 flex-col">
            <div ref={quillRef} className="flex-1" />
          </div>
        </ContentWrapperWithSidebar>
        <Sidebar
          data={blogPost}
          isOpen={isSidebarOpen}
          setData={setBlogPost}
          setOpen={setIsSidebarOpen}
        />
      </LayoutWithSidebar>
    </>
  )
}

export default Compose
