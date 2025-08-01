import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import forgeAPI from '@utils/forgeAPI'
import { useModalStore } from 'lifeforge-ui'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'

import ModifyIdeaModal from '../pages/Ideas/components/modals/ModifyIdeaModal'

export type IdeaBoxContainer = InferOutput<
  typeof forgeAPI.ideaBox.containers.list
>[number]

export type IdeaBoxFolder = InferOutput<
  typeof forgeAPI.ideaBox.folders.list
>[number]

export type IdeaBoxTag = InferOutput<typeof forgeAPI.ideaBox.tags.list>[number]

export type IdeaBoxIdea =
  | InferOutput<typeof forgeAPI.ideaBox.ideas.list>[number]
  | InferOutput<typeof forgeAPI.ideaBox.misc.search>[number]

interface IIdeaBoxData {
  pathValid: boolean
  pathDetails: InferOutput<typeof forgeAPI.ideaBox.misc.getPath> | undefined
  entriesQuery: UseQueryResult<IdeaBoxIdea[]>
  foldersQuery: UseQueryResult<IdeaBoxFolder[]>
  tagsQuery: UseQueryResult<IdeaBoxTag[]>
  searchResultsQuery: UseQueryResult<
    InferOutput<typeof forgeAPI.ideaBox.misc.search>
  >
  searchQuery: string
  debouncedSearchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
  viewArchived: boolean
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>
}

export const IdeaBoxContext = createContext<IIdeaBoxData | undefined>(undefined)

export default function IdeaBoxProvider({
  children
}: {
  children: React.ReactNode
}) {
  const open = useModalStore(state => state.open)

  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const [searchQuery, setSearchQuery] = useState('')

  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300)

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const [viewArchived, setViewArchived] = useState(
    searchParams.get('archived') === 'true'
  )

  const pathValidQuery = useQuery(
    forgeAPI.ideaBox.misc.checkValid
      .input({
        container: id || '',
        path: path || ''
      })
      .queryOptions({
        enabled: id !== undefined && path !== undefined
      })
  )

  const pathDetailsQuery = useQuery(
    forgeAPI.ideaBox.misc.getPath
      .input({
        container: id || '',
        path: path || ''
      })
      .queryOptions({
        enabled: id !== undefined && pathValidQuery.data
      })
  )

  const entriesQuery = useQuery(
    forgeAPI.ideaBox.ideas.list
      .input({
        container: id!,
        path: path || '',
        archived: viewArchived
      })
      .queryOptions({
        enabled: id !== undefined && pathValidQuery.data
      })
  )

  const foldersQuery = useQuery(
    forgeAPI.ideaBox.folders.list
      .input({
        container: id!,
        path: path || ''
      })
      .queryOptions({
        enabled: id !== undefined && pathValidQuery.data
      })
  )

  const tagsQuery = useQuery(
    forgeAPI.ideaBox.tags.list
      .input({
        container: id!
      })
      .queryOptions({
        enabled: id !== undefined && pathValidQuery.data && path !== ''
      })
  )

  const searchResultsQuery = useQuery(
    forgeAPI.ideaBox.misc.search
      .input({
        q: debouncedSearchQuery,
        container: id!,
        tags: selectedTags.join(','),
        folder: path?.split('/').pop() || ''
      })
      .queryOptions({
        enabled:
          id !== undefined &&
          path !== undefined &&
          pathValidQuery.data &&
          (debouncedSearchQuery.trim().length > 0 || selectedTags.length > 0)
      })
  )

  function onPasteImage(event: ClipboardEvent) {
    const items = event.clipboardData?.items

    let pastedImage: DataTransferItem | undefined

    for (let i = 0; i < items!.length; i++) {
      if (items![i].type.includes('image')) {
        pastedImage = items![i]
        break
      }
    }

    if (pastedImage === undefined) {
      return
    }

    if (!pastedImage.type.includes('image')) {
      toast.error('Invalid image in clipboard.')

      return
    }

    const file = pastedImage.getAsFile()

    const reader = new FileReader()

    if (file !== null) {
      reader.readAsDataURL(file)
    }

    reader.onload = function () {
      if (file !== null) {
        open(ModifyIdeaModal, {
          type: 'create',
          initialData: {
            type: 'image',
            image: file as never
          }
        })
      }
    }
  }

  useEffect(() => {
    setSearchParams({ archived: viewArchived.toString() })
  }, [viewArchived])

  useEffect(() => {
    if (id === undefined) {
      return
    }

    if (!pathValidQuery.isLoading && !pathValidQuery.data) {
      toast.error('Invalid ID')
      navigate('/idea-box')
    }
  }, [id, pathValidQuery.isLoading, pathValidQuery.data])

  useEffect(() => {
    document.addEventListener('paste', onPasteImage)

    return () => {
      document.removeEventListener('paste', onPasteImage)
    }
  }, [])

  useEffect(() => {
    if (path === '') {
      tagsQuery.refetch()
    }
  }, [entriesQuery.data, foldersQuery.data])

  const value = useMemo(
    () => ({
      pathValid: pathValidQuery.data ?? false,
      pathDetails: pathDetailsQuery.data,
      entriesQuery,
      foldersQuery,
      tagsQuery,
      searchResultsQuery,
      searchQuery,
      debouncedSearchQuery,
      setSearchQuery,
      selectedTags,
      setSelectedTags,
      viewArchived,
      setViewArchived
    }),
    [
      pathValidQuery.data,
      pathDetailsQuery.data,
      foldersQuery.data,
      tagsQuery.data,
      entriesQuery.data,
      searchResultsQuery.data,
      searchQuery,
      debouncedSearchQuery,
      selectedTags,
      viewArchived
    ]
  )

  return <IdeaBoxContext value={value}>{children}</IdeaBoxContext>
}

export function useIdeaBoxContext(): IIdeaBoxData {
  const context = useContext(IdeaBoxContext)

  if (context === undefined) {
    throw new Error('useIdeaBoxContext must be used within a IdeaBoxProvider')
  }

  return context
}
