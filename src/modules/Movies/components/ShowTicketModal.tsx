import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import { QRCodeSVG } from 'qrcode.react'

import { ModalHeader, ModalWrapper } from '@lifeforge/ui'

import { IMovieEntry } from '@modules/Movies/interfaces/movies_interfaces'

function ShowTicketModal({
  isOpen,
  onClose,
  entry
}: {
  isOpen: boolean
  onClose: () => void
  entry: IMovieEntry | undefined
}) {
  return (
    <ModalWrapper isOpen={isOpen} maxWidth="20rem">
      <ModalHeader
        icon="tabler:ticket"
        namespace="modules.movies"
        title="ticket.view"
        onClose={onClose}
      />
      {entry && (
        <>
          <div className="flex aspect-square h-auto w-full items-center justify-center rounded-lg bg-white p-8">
            <QRCodeSVG className="h-full w-full" value={entry.ticket_number} />,
          </div>
          <h2 className="mt-6 text-xl font-medium">{entry.title}</h2>
          <div className="text-bg-500 mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="size-5 shrink-0" icon="tabler:map-pin" />
              {entry.theatre_location}
            </div>
            <div className="flex items-center gap-2">
              <Icon className="size-5 shrink-0" icon="tabler:calendar" />
              {moment(entry.theatre_showtime).format('DD MMM YYYY, h:mm a')}
            </div>
            <div className="flex items-center gap-2">
              <Icon className="size-5 shrink-0" icon="tabler:hash" />
              Theatre No. {entry.theatre_number}
            </div>
            <div className="flex items-center gap-2">
              <Icon className="size-5 shrink-0" icon="mdi:love-seat-outline" />
              {entry.theatre_seat}
            </div>
          </div>
        </>
      )}
    </ModalWrapper>
  )
}

export default ShowTicketModal
