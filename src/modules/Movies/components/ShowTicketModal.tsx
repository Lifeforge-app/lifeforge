import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import { QRCodeSVG } from 'qrcode.react'
import React from 'react'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { IMovieEntry } from '@interfaces/movies_interfaces'

function ShowTicketModal({
  isOpen,
  onClose,
  entry
}: {
  isOpen: boolean
  onClose: () => void
  entry: IMovieEntry | undefined
}): React.ReactElement {
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
          <div className="w-full h-auto p-8 aspect-square bg-white rounded-lg flex items-center justify-center">
            <QRCodeSVG className="w-full h-full" value={entry.ticket_number} />,
          </div>
          <h2 className="text-xl mt-6 font-medium">{entry.title}</h2>
          <div className="mt-6 space-y-4 text-bg-500">
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
