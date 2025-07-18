import { UseQueryResult } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useModalStore } from 'lifeforge-ui'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate, useParams, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import { useAPIQuery } from 'shared/lib'
import { IdeaBoxControllersSchemas } from 'shared/types/controllers'

import ModifyIdeaModal from '../pages/Ideas/components/modals/ModifyIdeaModal'

interface IIdeaBoxData {
  pathValid: boolean
  pathValidLoading: boolean
  pathDetails:
    | IdeaBoxControllersSchemas.IMisc['getPath']['response']
    | undefined
  pathDetailsLoading: boolean
  entriesQuery: UseQueryResult<
    IdeaBoxControllersSchemas.IIdeas['getIdeas']['response']
  >
  foldersQuery: UseQueryResult<
    IdeaBoxControllersSchemas.IFolders['getFolders']['response']
  >
  tagsQuery: UseQueryResult<
    IdeaBoxControllersSchemas.ITags['getTags']['response']
  >
  searchResultsQuery: UseQueryResult<
    IdeaBoxControllersSchemas.IMisc['search']['response']
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

export default function IdeaBoxProvider() {
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

  const pathValidQuery = useAPIQuery<boolean>(
    `idea-box/valid/${id}/${path}`,
    ['idea-box', 'valid', id, path],
    id !== undefined && path !== undefined,
    {
      staleTime: Infinity
    }
  )

  const pathDetailsQuery = useAPIQuery<
    IdeaBoxControllersSchemas.IMisc['getPath']['response']
  >(
    `idea-box/path/${id}/${path}`,
    ['idea-box', 'path', id, path],
    id !== undefined && path !== undefined && pathValidQuery.data,
    {
      staleTime: Infinity
    }
  )

  const entriesQuery = useAPIQuery<
    IdeaBoxControllersSchemas.IIdeas['getIdeas']['response']
  >(
    `idea-box/ideas/${id}/${path}?archived=${viewArchived}`,
    ['idea-box', 'ideas', id, path, viewArchived],
    id !== undefined && path !== undefined && pathValidQuery.data,
    {
      staleTime: Infinity
    }
  )

  const foldersQuery = useAPIQuery<
    IdeaBoxControllersSchemas.IFolders['getFolders']['response']
  >(
    `idea-box/folders/${id}/${path}`,
    ['idea-box', 'folders', id, path],
    id !== undefined && path !== undefined && pathValidQuery.data,
    {
      staleTime: Infinity
    }
  )

  const tagsQuery = useAPIQuery<
    IdeaBoxControllersSchemas.ITags['getTags']['response']
  >(
    `idea-box/tags/${id}${path !== '' ? '?folder=' + path : ''}`,
    ['idea-box', 'tags', id, path],
    id !== undefined && path !== undefined && pathValidQuery.data,
    {
      staleTime: Infinity
    }
  )

  const searchResultsQuery = useAPIQuery<
    IdeaBoxControllersSchemas.IMisc['search']['response']
  >(
    `idea-box/search?q=${encodeURIComponent(
      debouncedSearchQuery.trim()
    )}&container=${id}&tags=${encodeURIComponent(selectedTags.join(','))}${
      path !== '' ? `&folder=${path?.split('/').pop()}` : ''
    }`,
    ['idea-box', 'search', id, path, selectedTags, debouncedSearchQuery],
    id !== undefined &&
      path !== undefined &&
      pathValidQuery.data &&
      (debouncedSearchQuery.trim().length > 0 || selectedTags.length > 0),
    {
      staleTime: Infinity
    }
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
