import { Box, ContextMenu, ContextMenuItem, useModalStore } from '@lifeforge/ui'

import ModifyTicketModal from '../../modals/ModifyTicketModal'
import { useMovieItemContext } from '../contexts/MovieItemContext'
import { useDeleteMovie } from '../hooks/useDeleteMovie'
import { useToggleWatched } from '../hooks/useToggleWatched'
import { useUpdateMovieData } from '../hooks/useUpdateMovieData'

function ActionMenu() {
  const { data } = useMovieItemContext()
  const { open } = useModalStore()
  const handleDeleteTicket = useDeleteMovie(data.id)
  const [updateDataLoading, handleUpdateData] = useUpdateMovieData(data.id)

  const handleToggleWatched = useToggleWatched({
    id: data.id,
    title: data.title,
    is_watched: data.is_watched
  })

  const handleUpdateTicket = () => {
    open(ModifyTicketModal, {
      initialData: data,
      type: data.ticket_number ? 'update' : 'create'
    })
  }

  return (
    <Box position="absolute" right="1em" top="1em">
      <ContextMenu>
        {data.is_watched && (
          <ContextMenuItem
            icon="tabler:eye-off"
            label="Mark as Unwatched"
            onClick={handleToggleWatched}
          />
        )}
        <ContextMenuItem
          icon="tabler:ticket"
          label={data.ticket_number ? 'Update Ticket' : 'Add Ticket'}
          onClick={handleUpdateTicket}
        />
        {data.tmdb_id !== -1 && (
          <ContextMenuItem
            icon="tabler:refresh"
            label="Update Movie Data"
            loading={updateDataLoading}
            shouldCloseMenuOnClick={false}
            onClick={handleUpdateData}
          />
        )}
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteTicket}
        />
      </ContextMenu>
    </Box>
  )
}

export default ActionMenu
