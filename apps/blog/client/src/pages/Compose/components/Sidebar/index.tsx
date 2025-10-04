//TODO: TO BE CONTINUED
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { Icon } from '@iconify/react'
import {
  Button,
  FileInput,
  ListboxInput,
  ListboxOption,
  SidebarWrapper,
  TagsInput,
  TextAreaInput,
  TextInput
} from 'lifeforge-ui'

const VISIBILITY_OPTIONS = [
  {
    label: 'Public',
    icon: 'uil:globe'
  },
  {
    label: 'Private',
    icon: 'tabler:lock'
  },
  {
    label: 'Unlisted',
    icon: 'tabler:eye-off'
  }
]

function Sidebar({
  data,
  setData,
  isOpen,
  setOpen
}: {
  data: any
  setData: React.Dispatch<React.SetStateAction<any>>
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
}) {
  return (
    <SidebarWrapper isOpen={isOpen} setOpen={setOpen}>
      <div className="flex h-full flex-col gap-3 p-4">
        <div className="mb-4 flex items-center gap-2">
          <Icon className="size-7" icon="tabler:file-settings" />
          <h2 className="text-xl font-semibold">Post Settings</h2>
        </div>
        <TextInput
          icon="tabler:article"
          label="Title"
          namespace="apps.blog"
          placeholder="Enter the title of your post..."
          setValue={(title: string) => {
            setData(prevData => ({ ...prevData, title }))
          }}
          value={data.title}
        />
        <TextAreaInput
          icon="tabler:quote"
          label="Excerpt"
          namespace="apps.blog"
          placeholder="Write a short excerpt for your post..."
          setValue={(excerpt: string) => {
            setData(prevData => ({ ...prevData, excerpt }))
          }}
          value={data.excerpt}
        />
        <ListboxInput
          buttonContent={
            <>
              <Icon
                icon={
                  VISIBILITY_OPTIONS.find(
                    option => option.label.toLowerCase() === data.visibility
                  )?.icon || 'tabler:eye'
                }
              />
              <span>
                {VISIBILITY_OPTIONS.find(
                  option => option.label.toLowerCase() === data.visibility
                )?.label || 'Public'}
              </span>
            </>
          }
          icon="tabler:eye"
          label="Visibility"
          namespace="apps.blog"
          setValue={(visibility: typeof data.visibility) => {
            setData(prevData => ({ ...prevData, visibility }))
          }}
          value={data.visibility}
        >
          {VISIBILITY_OPTIONS.map(option => (
            <ListboxOption
              key={option.label}
              icon={option.icon}
              label={option.label}
              value={option.label.toLowerCase()}
            />
          ))}
        </ListboxInput>
        <FileInput
          enableAI
          enablePixabay
          acceptedMimeTypes={{
            image: ['image/*']
          }}
          file={data.featuredImage}
          icon="tabler:photo"
          label="Featured Image"
          namespace="apps.blog"
          preview={data.featuredImagePreview}
          setData={(data: {
            image: File | string | null
            preview: string | null
          }) => {
            setData(prevData => ({
              ...prevData,
              featuredImage: data.image,
              featuredImagePreview: data.preview
            }))
          }}
          onImageRemoved={() => {
            setData(prevData => ({
              ...prevData,
              featuredImage: null,
              featuredImagePreview: null
            }))
          }}
        />
        {/* <ListboxInput
          icon="tabler:category"
          label="Category"
          namespace="apps.blog"
          setValue={(category: string | null) => {
            setData(prevData => ({ ...prevData, category }))
          }}
          value={data.category}
        /> */}
        <TagsInput
          icon="tabler:tags"
          label="labels"
          namespace="apps.blog"
          placeholder="Add tags to your post..."
          setValue={(labels: string[]) => {
            setData(prevData => ({ ...prevData, labels }))
          }}
          value={data.labels}
        />
        <div className="flex flex-1 flex-col justify-end gap-3">
          <Button
            className="mt-6 w-full"
            icon="tabler:file"
            variant="secondary"
          >
            Save to Drafts
          </Button>
          <Button className="w-full" icon="tabler:send">
            Publish
          </Button>
        </div>
      </div>
    </SidebarWrapper>
  )
}

export default Sidebar
