import { useMemo } from 'react'
import { useParams } from 'react-router'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import { IIdeaBoxTag } from '../../../../interfaces/ideabox_interfaces'
import TagItem from './components/TagItem'

const sortFunc = (a: IIdeaBoxTag, b: IIdeaBoxTag) => {
  if (a.count === b.count) {
    return a.name.localeCompare(b.name)
  }
  return b.count - a.count
}

function TagsSelector() {
  const { '*': path } = useParams<{ '*': string }>()
  const {
    tagsQuery,
    entriesQuery,
    searchResultsQuery,
    debouncedSearchQuery,
    viewArchived,
    selectedTags,
    setSelectedTags
  } = useIdeaBoxContext()
  const entries = entriesQuery.data ?? []
  const tags = tagsQuery.data ?? []
  const searchResults = searchResultsQuery.data ?? []

  const filteredTags = useMemo(() => {
    if (debouncedSearchQuery.trim().length > 0) {
      return tags
        .filter(tag => {
          return searchResults.some(entry => entry.tags?.includes(tag.name))
        })
        .sort(sortFunc)
    }

    if (path === '') return tags.sort(sortFunc)

    return tags
      .filter(tag => {
        return entriesQuery.data?.some(entry => entry.tags?.includes(tag.name))
      })
      .sort(sortFunc)
  }, [entries, searchResults, tags, path, debouncedSearchQuery])

  const countHashMap = useMemo(() => {
    const hashMap = new Map<string, number>()

    if (typeof filteredTags === 'string' || typeof searchResults === 'string') {
      return hashMap
    }

    const target =
      debouncedSearchQuery.trim().length > 0 ? searchResults : entries

    target.forEach(entry => {
      entry.tags?.forEach(tag => {
        hashMap.set(tag, (hashMap.get(tag) ?? 0) + 1)
      })
    })

    return hashMap
  }, [filteredTags, searchResults, entries, debouncedSearchQuery, tags])

  const handleSelectTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  return !viewArchived ? (
    tags.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <TagItem
            key={tag.id}
            countHashMap={countHashMap}
            tag={tag}
            onSelect={handleSelectTag}
          />
        ))}
      </div>
    )
  ) : (
    <></>
  )
}

export default TagsSelector
