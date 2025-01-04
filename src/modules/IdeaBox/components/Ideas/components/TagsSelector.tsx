import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import { useIdeaBoxContext } from '@providers/IdeaBoxProvider'
import { isLightColor } from '@utils/colors'

function TagsSelector(): React.ReactElement {
  const {
    tags,
    selectedTags,
    setSelectedTags,
    setExistedTag,
    setModifyTagModalOpenType
  } = useIdeaBoxContext()

  return (
    <APIFallbackComponent data={tags}>
      {tags =>
        tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags
              .sort((a, b) => {
                if (a.count === b.count) {
                  return a.name.localeCompare(b.name)
                }
                return b.count - a.count
              })
              .map(tag => (
                <div
                  key={tag.id}
                  onClick={() => {
                    if (selectedTags.includes(tag.name)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag.name))
                    } else {
                      setSelectedTags([...selectedTags, tag.name])
                    }
                  }}
                  className={`group inline-flex cursor-pointer items-center rounded-full px-3 py-1 transition-all ${
                    selectedTags.includes(tag.name)
                      ? tag.color !== ''
                        ? isLightColor(tag.color)
                          ? 'text-bg-800'
                          : 'text-bg-100'
                        : 'bg-custom-500/30 text-custom-500'
                      : 'bg-bg-200 text-bg-500 dark:bg-bg-700/50 dark:text-bg-300'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.name)
                      ? tag.color
                      : ''
                  }}
                >
                  {tag.icon !== '' && (
                    <Icon
                      icon={tag.icon}
                      className="mr-2 size-3 shrink-0"
                      style={{
                        color: !selectedTags.includes(tag.name) ? tag.color : ''
                      }}
                    />
                  )}
                  <span className="mr-2 shrink-0 text-sm">{tag.name}</span>
                  <span
                    className={`ml-[5px] text-xs group-hover:hidden ${
                      selectedTags.includes(tag.name)
                        ? tag.color !== ''
                          ? isLightColor(tag.color)
                            ? 'text-bg-800'
                            : 'text-bg-100'
                          : 'bg-custom-500/30 text-custom-500'
                        : 'text-bg-500'
                    }`}
                  >
                    {tag.count}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setExistedTag(tag)
                      setModifyTagModalOpenType('update')
                    }}
                    className={`hidden aspect-square h-full items-center justify-center rounded-full text-xs transition-all group-hover:flex ${
                      selectedTags.includes(tag.name)
                        ? tag.color !== ''
                          ? isLightColor(tag.color)
                            ? 'text-bg-800 hover:bg-bg-800 hover:text-bg-100'
                            : 'text-bg-100 hover:bg-bg-100 hover:text-bg-800'
                          : 'text-custom-500 hover:bg-custom-500/30 hover:text-custom-500'
                        : 'text-bg-500 hover:bg-bg-600 hover:text-bg-100'
                    }`}
                  >
                    <Icon icon="tabler:dots-vertical" />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <></>
        )
      }
    </APIFallbackComponent>
  )
}

export default TagsSelector
