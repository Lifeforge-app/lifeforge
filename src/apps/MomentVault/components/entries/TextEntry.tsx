import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useCallback } from 'react'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { IMomentVaultEntry } from '@apps/MomentVault/interfaces/moment_vault_interfaces'

import useComponentBg from '@hooks/useComponentBg'

function TextEntry({
  entry,
  page,
  onDelete
}: {
  entry: IMomentVaultEntry
  page: number
  onDelete: () => void
}) {
  const open = useModalStore(state => state.open)
  const { componentBg } = useComponentBg()

  const handleUpdateEntry = useCallback(() => {
    open('momentVault.modifyTextEntry', {
      existedData: entry,
      queryKey: ['moment-vault', 'entries', page]
    })
  }, [entry])

  return (
    <div
      className={clsx(
        'shadow-custom relative w-full gap-6 rounded-md p-6',
        componentBg
      )}
      id={`audio-entry-${entry.id}`}
    >
      <div className="mr-16">
        <div className="border-custom-500 border-l-4 pl-4">
          <p className="text-bg-500 whitespace-pre-wrap">{entry.content}</p>
        </div>
        <p className="text-bg-500 mt-4 flex items-center gap-2">
          <Icon icon="tabler:clock" /> {dayjs(entry.created).fromNow()}
        </p>
      </div>
      <HamburgerMenu classNames={{ wrapper: 'absolute top-4 right-4' }}>
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={handleUpdateEntry}
        />
        <MenuItem isRed icon="tabler:trash" text="Delete" onClick={onDelete} />
      </HamburgerMenu>
    </div>
  )
}

export default TextEntry
