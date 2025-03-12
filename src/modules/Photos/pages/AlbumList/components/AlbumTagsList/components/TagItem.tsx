import clsx from 'clsx'
import { useSearchParams } from 'react-router'

import { IPhotoAlbumTag } from '../../../../../interfaces/photos_interfaces'

function TagItem({
  tag,
  onClick
}: {
  tag: IPhotoAlbumTag
  onClick: (id: string) => void
}) {
  const [searchParams] = useSearchParams()

  return (
    <button
      key={tag.id}
      className={clsx(
        'shadow-custom whitespace-nowrap rounded-full px-3 py-1 text-sm tracking-wider',
        searchParams.getAll('tags')?.[0]?.split(',').includes(tag.id)
          ? 'bg-custom-500/20 text-custom-500 hover:bg-custom-500/40'
          : 'bg-bg-900 text-bg-500 hover:bg-bg-800'
      )}
      onClick={() => onClick(tag.id)}
    >
      {tag.name} ({tag.count})
    </button>
  )
}

export default TagItem
