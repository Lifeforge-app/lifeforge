import { UseQueryResult } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import { useModalStore } from '@lifeforge/ui'

import {
  IIdeaBoxContainer,
  type IIdeaBoxEntry,
  type IIdeaBoxFolder,
  type IIdeaBoxTag
} from '@apps/IdeaBox/interfaces/ideabox_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

interface IIdeaBoxData {
  pathValid: boolean
  pathValidLoading: boolean
  pathDetails:
    | {
        container: IIdeaBoxContainer
        path: IIdeaBoxFolder[]
      }
    | undefined
  pathDetailsLoading: boolean
  entriesQuery: UseQueryResult<IIdeaBoxEntry[]>
  foldersQuery: UseQueryResult<IIdeaBoxFolder[]>
  tagsQuery: UseQueryResult<IIdeaBoxTag[]>
  searchResultsQuery: UseQueryResult<IIdeaBoxEntry[]>

  searchQuery: string
  debouncedSearchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
  viewArchived: boolean
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>
}

export const IdeaBoxContext = createContext<IIdeaBoxData | undefined>(undefined)

export default function IdeaBoxProvider() {
  const open = useModalStore(state => state.open)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewArchived, setViewArchived] = useState(
    searchParams.get('archived') === 'true'
  )

  const pathValidQuery = useAPIQuery<boolean>(
    `idea-box/valid/${id}/${path}`,
    ['idea-box', 'valid', id, path],
    id !== undefined && path !== undefined
  )

  const pathDetailsQuery = useAPIQuery<{
    container: IIdeaBoxContainer
    path: IIdeaBoxFolder[]
  }>(
    `idea-box/path/${id}/${path}`,
    ['idea-box', 'path', id, path],
    id !== undefined && path !== undefined && pathValidQuery.data
  )

  const entriesQuery = useAPIQuery<IIdeaBoxEntry[]>(
    `idea-box/ideas/${id}/${path}?archived=${viewArchived}`,
    ['idea-box', 'ideas', id, path, viewArchived],
    id !== undefined && path !== undefined && pathValidQuery.data
  )

  const foldersQuery = useAPIQuery<IIdeaBoxFolder[]>(
    `idea-box/folders/${id}/${path}`,
    ['idea-box', 'folders', id, path],
    id !== undefined && path !== undefined && pathValidQuery.data
  )

  const tagsQuery = useAPIQuery<IIdeaBoxTag[]>(
    `idea-box/tags/${id}${path !== '' ? '?folder=' + path : ''}`,
    ['idea-box', 'tags', id, path],
    id !== undefined && path !== undefined && pathValidQuery.data
  )

  const searchResultsQuery = useAPIQuery<IIdeaBoxEntry[]>(
    `idea-box/search?q=${encodeURIComponent(
      debouncedSearchQuery.trim()
    )}&container=${id}&tags=${encodeURIComponent(selectedTags.join(','))}${
      path !== '' ? `&folder=${path?.split('/').pop()}` : ''
    }`,
    ['idea-box', 'search', id, path, selectedTags, debouncedSearchQuery],
    id !== undefined &&
      path !== undefined &&
      pathValidQuery.data &&
      (debouncedSearchQuery.trim().length > 0 || selectedTags.length > 0)
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
        open('ideaBox.ideas.modifyIdea', {
          type: 'paste',
          ideaType: 'image',
          pastedData: {
            preview: reader.result as string,
            file
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
      pathValidLoading: pathValidQuery.isLoading,
      pathDetails: pathDetailsQuery.data,
      pathDetailsLoading: pathDetailsQuery.isLoading,
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
      pathValidQuery.isLoading,
      pathDetailsQuery.data,
      pathDetailsQuery.isLoading,
      foldersQuery.data,
      foldersQuery.isLoading,
      tagsQuery.data,
      tagsQuery.isLoading,
      entriesQuery.data,
      entriesQuery.isLoading,
      searchResultsQuery.data,
      searchResultsQuery.isLoading,
      searchQuery,
      debouncedSearchQuery,
      selectedTags,
      viewArchived
    ]
  )

  return (
    <IdeaBoxContext value={value}>
      <Outlet />
    </IdeaBoxContext>
  )
}

export function useIdeaBoxContext(): IIdeaBoxData {
  const context = useContext(IdeaBoxContext)
  if (context === undefined) {
    throw new Error('useIdeaBoxContext must be used within a IdeaBoxProvider')
  }
  return context
}
