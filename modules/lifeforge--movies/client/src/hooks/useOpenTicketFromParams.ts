import { useEffect } from 'react'
import { useSearchParams } from 'react-router'

import { useModalStore } from '@lifeforge/ui'

import ShowTicketModal from '../components/modals/ShowTicketModal'
import type { MovieEntry } from '../index'

export function useOpenTicketFromParams(entries: MovieEntry[]) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { open } = useModalStore()

  useEffect(() => {
    const ticketId = searchParams.get('show-ticket')
    setSearchParams({}, { replace: true })

    if (!ticketId) return

    const target = entries.find(entry => entry.id === ticketId)

    if (!target || !target.ticket_number) return

    open(ShowTicketModal, { entry: target })
  }, [searchParams, setSearchParams, entries, open])
}
