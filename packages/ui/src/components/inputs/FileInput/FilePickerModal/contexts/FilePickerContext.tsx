import { createContext, useContext } from 'react'

import type { FilePickerSourceConfig } from '@/components/inputs'

interface FilePickerContextValue {
  file: File | string | null
  setFile: React.Dispatch<React.SetStateAction<string | File | null>>
  preview: string | null
  setPreview: React.Dispatch<React.SetStateAction<string | null>>
  acceptedMimeTypes?: Record<string, string[]>
  sources: FilePickerSourceConfig
}

const FilePickerContext = createContext<FilePickerContextValue | undefined>(
  undefined
)

export function useFilePicker(): FilePickerContextValue {
  const context = useContext(FilePickerContext)

  if (!context) {
    throw new Error(
      'useFilePicker must be used within a FilePickerContext.Provider'
    )
  }

  return context
}

export { FilePickerContext }
