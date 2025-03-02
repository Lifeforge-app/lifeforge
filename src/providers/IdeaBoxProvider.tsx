import { useQuery } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import {
  IIdeaBoxContainer,
  type IIdeaBoxEntry,
  type IIdeaBoxFolder,
  type IIdeaBoxTag
} from '@interfaces/ideabox_interfaces'
import APIRequestV2 from '@utils/newFetchData'

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
  entries: IIdeaBoxEntry[]
  entriesLoading: boolean
  folders: IIdeaBoxFolder[]
  foldersLoading: boolean
  tags: IIdeaBoxTag[]
  tagsLoading: boolean
  searchResults: IIdeaBoxEntry[]
  searchResultsLoading: boolean

  searchQuery: string
  debouncedSearchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
  viewArchived: boolean
  setViewArchived: React.Dispatch<React.SetStateAction<boolean>>

  typeOfModifyIdea: 'text' | 'image' | 'link'
  setTypeOfModifyIdea: React.Dispatch<
    React.SetStateAction<'text' | 'image' | 'link'>
  >
  modifyIdeaModalOpenType: null | 'create' | 'update' | 'paste'
  setModifyIdeaModalOpenType: React.Dispatch<
    React.SetStateAction<null | 'create' | 'update' | 'paste'>
  >
  modifyFolderModalOpenType: null | 'create' | 'update'
  setModifyFolderModalOpenType: React.Dispatch<
    React.SetStateAction<null | 'create' | 'update'>
  >
  modifyTagModalOpenType: null | 'create' | 'update'
  setModifyTagModalOpenType: React.Dispatch<
    React.SetStateAction<null | 'create' | 'update'>
  >

  pastedData: {
    preview: string
    file: File
  } | null
  setPastedData: React.Dispatch<
    React.SetStateAction<{
      preview: string
      file: File
    } | null>
  >

  existedEntry: IIdeaBoxEntry | null
  setExistedEntry: React.Dispatch<React.SetStateAction<IIdeaBoxEntry | null>>
  existedTag: IIdeaBoxTag | null
  setExistedTag: React.Dispatch<React.SetStateAction<IIdeaBoxTag | null>>
  existedFolder: IIdeaBoxFolder | null
  setExistedFolder: React.Dispatch<React.SetStateAction<IIdeaBoxFolder | null>>

  deleteIdeaConfirmationModalOpen: boolean
  setDeleteIdeaConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  deleteFolderConfirmationModalOpen: boolean
  setDeleteFolderConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}

export const IdeaBoxContext = React.createContext<IIdeaBoxData | undefined>(
  undefined
)

export default function IdeaBoxProvider({
  children
}: {
  children: React.ReactNode
}): React.ReactElement {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { id, '*': path } = useParams<{ id: string; '*': string }>()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewArchived, setViewArchived] = useState(
    searchParams.get('archived') === 'true'
  )

  const pathValidQuery = useQuery<boolean>({
    queryKey: ['idea-box', 'valid', id, path],
    queryFn: () => APIRequestV2(`idea-box/valid/${id}/${path}`),
    enabled: id !== undefined && path !== undefined
  })

  const pathDetailsQuery = useQuery<{
    container: IIdeaBoxContainer
    path: IIdeaBoxFolder[]
  }>({
    queryKey: ['idea-box', 'details', id, path],
    queryFn: () => APIRequestV2(`idea-box/path/${id}/${path}`),
    enabled: id !== undefined && path !== undefined && pathValidQuery.data
  })

  const entriesQuery = useQuery<IIdeaBoxEntry[]>({
    queryKey: ['idea-box', 'ideas', id, path, viewArchived],
    queryFn: () =>
      APIRequestV2(`idea-box/ideas/${id}/${path}?archived=${viewArchived}`),
    enabled: id !== undefined && path !== undefined && pathValidQuery.data
  })

  const foldersQuery = useQuery<IIdeaBoxFolder[]>({
    queryKey: ['idea-box', 'folders', id, path],
    queryFn: () => APIRequestV2(`idea-box/folders/${id}/${path}`),
    enabled: id !== undefined && path !== undefined && pathValidQuery.data
  })

  const tagsQuery = useQuery<IIdeaBoxTag[]>({
    queryKey: ['idea-box', 'tags', id],
    queryFn: () => APIRequestV2(`idea-box/tags/${id}`),
    enabled: id !== undefined
  })

  const searchResultsQuery = useQuery<IIdeaBoxEntry[]>({
    queryKey: [
      'idea-box',
      'search',
      id,
      path,
      selectedTags,
      debouncedSearchQuery
    ],
    queryFn: () =>
      APIRequestV2(
        `idea-box/search?q=${encodeURIComponent(
          debouncedSearchQuery.trim()
        )}&container=${id}&tags=${encodeURIComponent(selectedTags.join(','))}${
          path !== '' ? `&folder=${path?.split('/').pop()}` : ''
        }`
      ),
    enabled:
      id !== undefined &&
      path !== undefined &&
      pathValidQuery.data &&
      (debouncedSearchQuery.trim().length > 0 || selectedTags.length > 0)
  })

  const [modifyIdeaModalOpenType, setModifyIdeaModalOpenType] = useState<
    null | 'create' | 'update' | 'paste'
  >(null)
  const [modifyFolderModalOpenType, setModifyFolderModalOpenType] = useState<
    null | 'create' | 'update'
  >(null)
  const [modifyTagModalOpenType, setModifyTagModalOpenType] = useState<
    null | 'create' | 'update'
  >(null)
  const [typeOfModifyIdea, setTypeOfModifyIdea] = useState<
    'text' | 'image' | 'link'
  >('text')

  const [existedEntry, setExistedEntry] = useState<IIdeaBoxEntry | null>(null)
  const [existedTag, setExistedTag] = useState<IIdeaBoxTag | null>(null)
  const [existedFolder, setExistedFolder] = useState<IIdeaBoxFolder | null>(
    null
  )
  const [pastedData, setPastedData] = useState<{
    preview: string
    file: File
  } | null>(null)

  const [deleteIdeaConfirmationModalOpen, setDeleteIdeaConfirmationModalOpen] =
    useState(false)
  const [
    deleteFolderConfirmationModalOpen,
    setDeleteFolderConfirmationModalOpen
  ] = useState(false)

  function onPasteImage(event: ClipboardEvent): void {
    if (modifyIdeaModalOpenType !== null) return

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
        setModifyIdeaModalOpenType('paste')
        setTypeOfModifyIdea('image')
        setPastedData({
          preview: reader.result as string,
          file
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

    console.log(pathValidQuery.isLoading, pathValidQuery.data)

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
  }, [modifyIdeaModalOpenType])

  const value = useMemo(
    () => ({
      pathValid: pathValidQuery.data ?? false,
      pathValidLoading: pathValidQuery.isLoading,
      pathDetails: pathDetailsQuery.data,
      pathDetailsLoading: pathDetailsQuery.isLoading,
      entries: entriesQuery.data ?? [],
      entriesLoading: entriesQuery.isLoading,
      folders: foldersQuery.data ?? [],
      foldersLoading: foldersQuery.isLoading,
      tags: tagsQuery.data ?? [],
      tagsLoading: tagsQuery.isLoading,
      searchResults: searchResultsQuery.data ?? [],
      searchResultsLoading: searchResultsQuery.isLoading,
      searchQuery,
      debouncedSearchQuery,
      setSearchQuery,
      selectedTags,
      setSelectedTags,
      viewArchived,
      setViewArchived,
      typeOfModifyIdea,
      setTypeOfModifyIdea,
      modifyIdeaModalOpenType,
      setModifyIdeaModalOpenType,
      modifyFolderModalOpenType,
      setModifyFolderModalOpenType,
      modifyTagModalOpenType,
      setModifyTagModalOpenType,
      pastedData,
      setPastedData,
      existedEntry,
      setExistedEntry,
      existedTag,
      setExistedTag,
      existedFolder,
      setExistedFolder,
      deleteIdeaConfirmationModalOpen,
      setDeleteIdeaConfirmationModalOpen,
      deleteFolderConfirmationModalOpen,
      setDeleteFolderConfirmationModalOpen
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
      viewArchived,
      typeOfModifyIdea,
      modifyIdeaModalOpenType,
      modifyFolderModalOpenType,
      modifyTagModalOpenType,
      pastedData,
      existedEntry,
      existedTag,
      existedFolder,
      deleteIdeaConfirmationModalOpen,
      deleteFolderConfirmationModalOpen
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
