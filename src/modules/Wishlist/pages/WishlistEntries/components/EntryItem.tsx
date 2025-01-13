import React from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import useThemeColors from '@hooks/useThemeColor'
import { type IWishlistEntry } from '@interfaces/wishlist_interfaces'
import { numberToMoney } from '@utils/strings'

function EntryItem({
  entry,
  collectionId
}: {
  entry: IWishlistEntry
  collectionId: string
}): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <li
      className={`${componentBg} flex flex-col justify-between gap-4 rounded-md p-4 sm:flex-row sm:items-center`}
    >
      <div className="flex items-center gap-4">
        <img
          src={`${import.meta.env.VITE_API_HOST}/media/${collectionId}/${
            entry.id
          }/${entry.image}`}
          alt={entry.name}
          className="size-20 rounded-md"
        />
        <div>
          <h2 className="text-lg font-medium text-zinc-500">{entry.name}</h2>
          <p className="text-2xl">RM {numberToMoney(entry.price)}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Button
          as="a"
          href={entry.url}
          target="_blank"
          variant="secondary"
          className="w-full sm:w-auto"
          icon="tabler:link"
        >
          Visit Website
        </Button>
        <Button
          icon="tabler:check"
          variant="primary"
          onClick={() => {}}
          className="w-full sm:w-auto"
        >
          Mark as bought
        </Button>
      </div>
    </li>
  )
}

export default EntryItem
