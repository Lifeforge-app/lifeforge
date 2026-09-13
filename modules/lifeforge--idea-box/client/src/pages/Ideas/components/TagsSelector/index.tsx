import { useCallback, useMemo } from 'react'
import { useParams } from 'react-router'

import { useModalStore } from '@lifeforge/ui'

import { type IdeaBoxTag, useIdeaBoxContext } from '@/providers/IdeaBoxProvider'

import ModifyTagModal from '../modals/ModifyTagModal'
import TagItem from './components/TagItem'

const sortFunc = (a: IdeaBoxTag, b: IdeaBoxTag) => {
  if (a.amount === b.amount) {
    return a.name.localeCompare(b.name)
  }

  return b.amount - a.amount
}

function TagsSelector() {
  const { open } = useModalStore()
  const { '*': path } = useParams<{ '*': string }>()

  const {
    tagsQuery,
    entriesQuery,
    searchResultsQuery,
    searchQuery,
    viewArchived,
    selectedTags,
    setSelectedTags
  } = useIdeaBoxContext()

  const entries = entriesQuery.data ?? []

  const tags = tagsQuery.data ?? []

  const searchResults = searchResultsQuery.data ?? []

  const filteredTags = useMemo(() => {
    if (searchQuery.trim().length > 0) {
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
  }, [entries, searchResults, tags, path, searchQuery])

  const countHashMap = useMemo(() => {
    const hashMap = new Map<string, number>()

    const target = searchQuery.trim().length > 0 ? searchResults : entries

    target.forEach(entry => {
      entry.tags?.forEach((tag: string) => {
        hashMap.set(tag, (hashMap.get(tag) ?? 0) + 1)
      })
    })

    return hashMap
  }, [filteredTags, searchResults, entries, searchQuery, tags])

  const handleSelectTag = useCallback((tagName: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName)
      } else {
        return [...prev, tagName]
      }
    })
  }, [])

  const handleUpdateTag = useCallback(
    (id: string) => {
      const tag = tags.find(tag => tag.id === id)

      if (tag) {
        open(ModifyTagModal, {
          type: 'update',
          initialData: tag
        })
      }
    },
    [tags]
  )

  return !viewArchived ? (
    tags.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.map(tag => {
          const tagCount =
            path === '' && searchQuery.trim().length === 0
              ? tag.amount
              : (countHashMap.get(tag.name) ?? 0)

          return (
            <TagItem
              key={tag.id}
              amount={tagCount}
              color={tag.color}
              icon={tag.icon}
              id={tag.id}
              isSelected={selectedTags.includes(tag.name)}
              label={tag.name}
              onSelect={handleSelectTag}
              onUpdate={handleUpdateTag}
            />
          )
        })}
      </div>
    )
  ) : (
    <></>
  )
}

export default TagsSelector
