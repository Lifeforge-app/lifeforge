import React, { useMemo } from 'react'
import { useParams } from 'react-router'

import { APIFallbackComponent } from '@lifeforge/ui'

import { useIdeaBoxContext } from '@modules/IdeaBox/providers/IdeaBoxProvider'

import { IIdeaBoxTag } from '../../../../interfaces/ideabox_interfaces'
import TagItem from './components/TagItem'

const sortFunc = (a: IIdeaBoxTag, b: IIdeaBoxTag) => {
  if (a.count === b.count) {
    return a.name.localeCompare(b.name)
  }
  return b.count - a.count
}

function TagsSelector(): React.ReactElement {
  const { '*': path } = useParams<{ '*': string }>()
  const {
    tags,
    tagsLoading,
    entries,
    entriesLoading,
    searchResults,
    debouncedSearchQuery,
    viewArchived,
    selectedTags,
    setSelectedTags
  } = useIdeaBoxContext()

  const filteredTags = useMemo(() => {
    if (tagsLoading || entriesLoading || typeof entries === 'string') {
      return 'loading'
    }

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
        return entries.some(entry => entry.tags?.includes(tag.name))
      })
      .sort(sortFunc)
  }, [entries, searchResults, tags, path, debouncedSearchQuery])

  const countHashMap = useMemo(() => {
    const hashMap = new Map<string, number>()

    if (
      typeof filteredTags === 'string' ||
      typeof searchResults === 'string' ||
      entriesLoading
    ) {
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
  }, [
    filteredTags,
    searchResults,
    entries,
    debouncedSearchQuery,
    entriesLoading,
    tags,
    tagsLoading
  ])

  const handleSelectTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(t => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  return !viewArchived ? (
    <APIFallbackComponent data={filteredTags} showLoading={false}>
      {tags =>
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
      }
    </APIFallbackComponent>
  ) : (
    <></>
  )
}

export default TagsSelector
