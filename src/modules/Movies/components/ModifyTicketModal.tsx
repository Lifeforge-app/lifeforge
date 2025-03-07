import React, { useEffect, useRef, useState } from 'react'
import FormModal from '@components/modals/FormModal'
import { IFieldProps } from '@interfaces/modal_interfaces'
import { IMovieTicketFormState } from '@interfaces/movies_interfaces'

function ModifyTicketModal({
  openType,
  setOpenType,
  targetId
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  targetId: string
}): React.ReactElement {
  const [formState, setFormState] = useState<IMovieTicketFormState>({
    entry_id: '',
    ticket_number: '',
    theatre_location: '',
    theatre_number: '',
    theatre_seat: '',
    theatre_showtime: ''
  })
  const modalRef = useRef<HTMLDivElement | null>(null)

  const FIELDS: IFieldProps<IMovieTicketFormState>[] = [
    {
      id: 'ticket_number',
      label: 'Ticket number',
      icon: 'tabler:ticket',
      placeholder: '123456789',
      type: 'text'
    },
    {
      id: 'theatre_seat',
      label: 'Theatre seat',
      icon: 'mdi:love-seat-outline',
      placeholder: 'A1',
      type: 'text'
    },
    {
      id: 'theatre_location',
      label: 'Theatre location',
      type: 'location'
    },
    {
      id: 'theatre_showtime',
      label: 'Theatre showtime',
      icon: 'tabler:clock',
      type: 'datetime',
      hasTime: true,
      index: 0,
      modalRef
    },
    {
      id: 'theatre_number',
      label: 'Theatre number',
      icon: 'tabler:hash',
      placeholder: '1',
      type: 'text'
    }
  ]

  useEffect(() => {
    if (targetId) {
      setFormState(prev => ({
        ...prev,
        entry_id: targetId
      }))
    }
  }, [targetId])

  return (
    <FormModal
      data={formState}
      endpoint="/movies/entries/ticket"
      fields={FIELDS}
      icon="tabler:ticket"
      id={targetId}
      isOpen={openType !== null}
      modalRef={modalRef}
      namespace="modules.movies"
      openType={openType}
      queryKey={['movies', 'entries']}
      setData={setFormState}
      title={`ticket.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyTicketModal
