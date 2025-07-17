// @ts-expect-error no types available
import Column from 'react-columns'

import { useIdeaBoxContext } from '@apps/IdeaBox/providers/IdeaBoxProvider'

import { type IIdeaBoxEntry } from '../../../../../interfaces/ideabox_interfaces'
import EntryImage from './IdeaEntry/EntryImage'
import EntryLink from './IdeaEntry/EntryLink'
import EntryText from './IdeaEntry/EntryText'

function IdeaList({ data }: { data: IIdeaBoxEntry[] }) {
  const { selectedTags } = useIdeaBoxContext()

  return (
    <Column
      className="mb-8 shrink-0 overflow-x-visible!"
      gap="0.5rem"
      queries={[
        {
          columns: 1,
          query: 'min-width: 0px'
        },
        {
          columns: 1,
          query: 'min-width: 768px'
        },
        {
          columns: 2,
          query: 'min-width: 1024px'
        },
        {
          columns: 3,
          query: 'min-width: 1280px'
        },
        {
          columns: 4,
          query: 'min-width: 1536px'
        }
      ]}
    >
      {data
        .filter(item => {
          if (selectedTags.length === 0) {
            return true
          }

          return selectedTags.every(tag => item.tags?.includes(tag))
        })
        .map(entry => {
          const Component = {
            image: EntryImage,
            text: EntryText,
            link: EntryLink
          }[entry.type]

          return <Component key={entry.id} entry={entry} />
        })}
    </Column>
  )
}

export default IdeaList
