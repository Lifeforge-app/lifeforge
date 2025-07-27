//TODO: TO BE CONTINUED
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import { Icon } from '@iconify/react'
import {
  Button,
  FileInput,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  SidebarWrapper,
  TagsInput,
  TextAreaInput,
  TextInput
} from 'lifeforge-ui'

import { IBlogEntryFormState } from '@apps/Blog/interfaces/blog_interfaces'

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
  data: IBlogEntryFormState
  setData: React.Dispatch<React.SetStateAction<IBlogEntryFormState>>
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
          darker
          icon="tabler:article"
          name="Title"
          namespace="apps.blog"
          placeholder="Enter the title of your post..."
          setValue={(title: string) => {
            setData(prevData => ({ ...prevData, title }))
          }}
          value={data.title}
        />
        <TextAreaInput
          darker
          icon="tabler:quote"
          name="Excerpt"
          namespace="apps.blog"
          placeholder="Write a short excerpt for your post..."
          setValue={(excerpt: string) => {
            setData(prevData => ({ ...prevData, excerpt }))
          }}
          value={data.excerpt}
        />
        <ListboxOrComboboxInput
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
          name="Visibility"
          namespace="apps.blog"
          setValue={(visibility: typeof data.visibility) => {
            setData(prevData => ({ ...prevData, visibility }))
          }}
          type="listbox"
          value={data.visibility}
        >
          {VISIBILITY_OPTIONS.map(option => (
            <ListboxOrComboboxOption
              key={option.label}
              icon={option.icon}
              text={option.label}
              value={option.label.toLowerCase()}
            />
          ))}
        </ListboxOrComboboxInput>
        <FileInput
          enableAI
          enablePixabay
          acceptedMimeTypes={{
            image: ['image/*']
          }}
          file={data.featuredImage}
          icon="tabler:photo"
          name="Featured Image"
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
        {/* <ListboxOrComboboxInput
          icon="tabler:category"
          name="Category"
          namespace="apps.blog"
          setValue={(category: string | null) => {
            setData(prevData => ({ ...prevData, category }))
          }}
          type="listbox"
          value={data.category}
        /> */}
        <TagsInput
          darker
          icon="tabler:tags"
          name="labels"
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
