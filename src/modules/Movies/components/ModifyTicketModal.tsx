import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import FormModal from '@components/modals/FormModal'
import { IFieldProps } from '@interfaces/modal_interfaces'
import {
  IMovieEntry,
  IMovieTicketFormState
} from '@interfaces/movies_interfaces'
import fetchAPI from '@utils/fetchAPI'

function ModifyTicketModal({
  openType,
  setOpenType,
  existedData,
  queryKey
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: IMovieEntry | null
  queryKey: unknown[]
}): React.ReactElement {
  const queryClient = useQueryClient()
  const [
    deleteTicketConfirmationModalOpen,
    setDeleteTicketConfirmationModalOpen
  ] = useState(false)
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
      type: 'text',
      qrScanner: true
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

  async function deleteTicket() {
    try {
      await fetchAPI(`/movies/entries/ticket/${existedData?.id}`, {
        method: 'DELETE'
      })

      queryClient.setQueryData<IMovieEntry[]>(queryKey, oldData => {
        if (!oldData) return oldData
        return oldData.map(entry => {
          if (entry.id === existedData?.id) {
            return {
              ...entry,
              ticket_number: '',
              theatre_location: '',
              theatre_number: '',
              theatre_seat: '',
              theatre_showtime: ''
            }
          }

          return entry
        })
      })

      toast.success('Ticket deleted successfully!')
      setDeleteTicketConfirmationModalOpen(false)
      setOpenType(null)
    } catch {
      toast.error('Failed to delete ticket')
    }
  }

  useEffect(() => {
    if (!existedData) return

    if (openType === 'create') {
      setFormState(prev => ({
        ...prev,
        entry_id: existedData.id,
        ticket_number: '',
        theatre_location: '',
        theatre_number: '',
        theatre_seat: '',
        theatre_showtime: ''
      }))
      return
    }

    if (openType === 'update') {
      setFormState({
        entry_id: existedData.id,
        ticket_number: existedData.ticket_number,
        theatre_location: existedData.theatre_location,
        theatre_number: existedData.theatre_number,
        theatre_seat: existedData.theatre_seat,
        theatre_showtime: existedData.theatre_showtime
      })
    }
  }, [openType, existedData])

  function updateDataList(newData: IMovieEntry) {
    queryClient.setQueryData<IMovieEntry[]>(queryKey, oldData => {
      if (!oldData) return oldData
      return oldData.map(entry => {
        if (entry.id === newData.id) {
          return newData
        }
        return entry
      })
    })
  }

  return (
    <>
      <FormModal
        actionButtonIsRed
        actionButtonIcon={openType === 'update' ? 'tabler:trash' : ''}
        customUpdateDataList={{
          create: updateDataList,
          update: updateDataList
        }}
        data={formState}
        endpoint="/movies/entries/ticket"
        fields={FIELDS}
        icon="tabler:ticket"
        id={existedData?.id}
        isOpen={openType !== null}
        modalRef={modalRef}
        namespace="modules.movies"
        openType={openType}
        queryKey={queryKey}
        setData={setFormState}
        title={`ticket.${openType}`}
        onActionButtonClick={() => setDeleteTicketConfirmationModalOpen(true)}
        onClose={() => {
          setOpenType(null)
        }}
      />
      <DeleteConfirmationModal
        customOnClick={deleteTicket}
        isOpen={deleteTicketConfirmationModalOpen}
        itemName="ticket"
        onClose={() => setDeleteTicketConfirmationModalOpen(false)}
      />
    </>
  )
}

export default ModifyTicketModal
