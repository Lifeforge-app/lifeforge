import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { APIFallbackComponent, ModalHeader, ModalWrapper } from '@lifeforge/ui'

import useFetch from '@hooks/useFetch'

import { encrypt } from '@utils/encryption'

import { type IJournalEntry } from '../interfaces/journal_interfaces'
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
}) {
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
    <ModalWrapper className="md:min-w-[60rem]!" isOpen={isOpen}>
      <ModalHeader
        icon="tabler:eye"
        title="View Journal Entry"
        onClose={onClose}
      />
      <APIFallbackComponent data={entry}>
        {entry => (
          <JournalView
            cleanedUpText={entry.content}
            date={entry.date}
            mood={entry.mood}
            photos={entry.photos.map(
              photo =>
                `${import.meta.env.VITE_API_HOST}/media/${entry.collectionId}/${
                  entry.id
                }/${photo}?token=${entry.token}`
            )}
            rawText={entry.raw}
            summarizedText={entry.summary}
            title={entry.title}
          />
        )}
      </APIFallbackComponent>
    </ModalWrapper>
  )
}

export default JournalViewModal
