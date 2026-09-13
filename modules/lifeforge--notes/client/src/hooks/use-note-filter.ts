import { parseAsString, useQueryState } from 'nuqs'

export function useNoteFilter() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    parseAsString.withDefault('')
  )
  const [selectedNoteId, setSelectedNoteId] = useQueryState(
    'note',
    parseAsString.withDefault('')
  )

  return {
    searchQuery,
    selectedNoteId,
    setSearchQuery,
    setSelectedNoteId
  }
}
