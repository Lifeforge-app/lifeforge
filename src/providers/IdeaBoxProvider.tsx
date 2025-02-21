import { useDebounce } from '@uidotdev/usehooks'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'
import useFetch from '@hooks/useFetch'
import { type Loadable } from '@interfaces/common'
import {
  type IIdeaBoxEntry,
  type IIdeaBoxFolder,
  type IIdeaBoxTag
} from '@interfaces/ideabox_interfaces'
import APIRequest from '@utils/fetchData'

interface IIdeaBoxData {
  valid: boolean | 'loading' | 'error'
  entries: Loadable<IIdeaBoxEntry[]>
  folders: Loadable<IIdeaBoxFolder[]>
  tags: Loadable<IIdeaBoxTag[]>
  searchResults: Loadable<IIdeaBoxEntry[]>

  setEntries: React.Dispatch<React.SetStateAction<Loadable<IIdeaBoxEntry[]>>>
  setFolders: React.Dispatch<React.SetStateAction<Loadable<IIdeaBoxFolder[]>>>
  setTags: React.Dispatch<React.SetStateAction<Loadable<IIdeaBoxTag[]>>>
  setSearchResults: React.Dispatch<
    React.SetStateAction<Loadable<IIdeaBoxEntry[]>>
  >

  refreshEntries: () => void
  refreshFolders: () => void
  refreshTags: () => void
  refreshSearchResults: () => void

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

  const [valid] = useFetch<boolean>(`idea-box/valid/${id}/${path}`)

  const [searchResults, setSearchResults] = useState<Loadable<IIdeaBoxEntry[]>>(
    []
  )
  const [entries, setEntries] = useState<Loadable<IIdeaBoxEntry[]>>('loading')
  const [folders, setFolders] = useState<Loadable<IIdeaBoxFolder[]>>('loading')
  const [tags, setTags] = useState<Loadable<IIdeaBoxTag[]>>('loading')

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

  function refreshData(): void {
    setEntries('loading')
    APIRequest({
      endpoint: `idea-box/ideas/${id}/${path}?archived=${viewArchived}`,
      method: 'GET',
      callback: data => {
        setEntries(data.data)
      },
      onFailure: () => {
        setEntries('error')
      }
    }).catch(() => {
      setEntries('error')
    })
  }

  function refreshSearchResults(): void {
    setSearchResults('loading')
    APIRequest({
      endpoint: `idea-box/search?q=${encodeURIComponent(
        debouncedSearchQuery.trim()
      )}&container=${id}&tags=${encodeURIComponent(selectedTags.join(','))}${
        path !== '' ? `&folder=${path?.split('/').pop()}` : ''
      }`,
      method: 'GET',
      callback: data => {
        setSearchResults(data.data)
      },
      onFailure: () => {
        setSearchResults('error')
      }
    }).catch(() => {
      setSearchResults('error')
    })
  }

  function refreshFolders(): void {
    setFolders('loading')
    APIRequest({
      endpoint: `idea-box/folders/${id}/${path}`,
      method: 'GET',
      callback: data => {
        setFolders(data.data)
      },
      onFailure: () => {
        setFolders('error')
      }
    }).catch(() => {
      setFolders('error')
    })
  }

  function refreshTags(): void {
    setTags('loading')
    APIRequest({
      endpoint: `idea-box/tags/${id}`,
      method: 'GET',
      callback: data => {
        setTags(data.data)
      }
    }).catch(() => {
      setTags('error')
    })
  }

  useEffect(() => {
    if (valid === true) {
      refreshData()
      refreshFolders()
      refreshTags()
    }
  }, [id, path, viewArchived, valid])

  useEffect(() => {
    setSearchParams({ archived: viewArchived.toString() })
  }, [viewArchived])

  useEffect(() => {
    if (
      debouncedSearchQuery.trim().length > 0 ||
      (selectedTags.length > 0 && path === '')
    ) {
      refreshSearchResults()
    } else {
      setSearchResults([])
    }
  }, [debouncedSearchQuery, selectedTags, path])

  useEffect(() => {
    if (id === undefined) {
      return
    }

    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/idea-box')
    }
  }, [valid, id])

  useEffect(() => {
    document.addEventListener('paste', onPasteImage)

    return () => {
      document.removeEventListener('paste', onPasteImage)
    }
  }, [modifyIdeaModalOpenType])

  const value = useMemo(
    () => ({
      valid,
      entries,
      folders,
      tags,
      searchResults,
      setEntries,
      setFolders,
      setTags,
      setSearchResults,
      refreshEntries: refreshData,
      refreshFolders,
      refreshTags,
      refreshSearchResults,
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
      valid,
      entries,
      folders,
      tags,
      searchResults,
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
