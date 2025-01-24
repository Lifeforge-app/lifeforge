import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { encrypt } from '@utils/encryption'
import JournalView from './JournalView'

function JournalViewModal({
  id,
  isOpen,
  onClose,
  masterPassword
}: {
  id: string | null
  isOpen: boolean
  onClose: () => void
  masterPassword: string
}): React.ReactElement {
  const navigate = useNavigate()
  const [valid, , setValid] = useFetch<boolean>(
    `journal/entries/valid/${id}`,
    id !== null
  )
  const [challenge, , setChallenge] = useFetch<string>(
    'journal/auth/challenge',
    valid === true
  )
  const url = useMemo(() => {
    if (valid === true && challenge !== 'loading') {
      return `journal/entries/get/${id}?master=${encodeURIComponent(
        encrypt(masterPassword, challenge)
      )}`
    } else {
      return ''
    }
  }, [challenge, valid])

  const [entry, , setEntry] = useFetch<IJournalEntry>(url, url !== '')

  useEffect(() => {
    if (valid === false && id !== null) {
      toast.error('Invalid ID')
      navigate('/journal')
    }
  }, [valid])

  useEffect(() => {
    if (!isOpen) {
      setValid(false)
      setEntry('loading')
      setChallenge('loading')
    }
  }, [id, isOpen])

  return (
    <ModalWrapper isOpen={isOpen} className="md:!min-w-[60rem]">
      <ModalHeader
        icon="tabler:eye"
        title="View Journal Entry"
        onClose={onClose}
      />
      <APIFallbackComponent data={entry}>
        {entry => (
          <JournalView
            date={entry.date}
            title={entry.title}
            mood={entry.mood}
            cleanedUpText={entry.content}
            photos={entry.photos.map(
              photo =>
                `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
                  entry.id
                }/${photo}?token=${entry.token}`
            )}
            rawText={entry.raw}
            summarizedText={entry.summary}
          />
        )}
      </APIFallbackComponent>
    </ModalWrapper>
  )
}

export default JournalViewModal
