/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import {
//   MDXEditor,
//   headingsPlugin,
//   listsPlugin,
//   quotePlugin,
//   thematicBreakPlugin
// } from '@mdxeditor/editor'
import moment from 'moment'
import React, { useEffect, useMemo, useState } from 'react'

// import '@mdxeditor/editor/style.css'
import Markdown from 'react-markdown'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IJournalEntry } from '@interfaces/journal_interfaces'
import { encrypt } from '@utils/encryption'

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
    `journal/entry/valid/${id}`,
    id !== null
  )
  const [challenge, , setChallenge] = useFetch<string>(
    '/journal/auth/challenge',
    valid === true
  )
  const url = useMemo(() => {
    if (valid === true && challenge !== 'loading') {
      return `journal/entry/get/${id}?master=${encodeURIComponent(
        encrypt(masterPassword, challenge)
      )}`
    } else {
      return ''
    }
  }, [challenge, valid])

  const [entry, , setEntry] = useFetch<IJournalEntry>(url, url !== '')
  const [viewRaw, setViewRaw] = useState(false)

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
    <Modal isOpen={isOpen} className="md:!min-w-[60rem]">
      <ModalHeader
        icon="tabler:eye"
        title="View Journal Entry"
        onClose={onClose}
      />
      <APIComponentWithFallback data={entry}>
        {entry => (
          <>
            <div className="flex-between mb-6 flex">
              <h2 className="text-4xl font-semibold">
                {moment(entry.date).format('MMMM Do, YYYY')}
              </h2>
              <span className="block rounded-full bg-bg-700/50 px-3 py-1 text-base font-medium">
                {entry.mood.emoji} {entry.mood.text}
              </span>
            </div>
            <p className="mb-6 text-lg">
              <span className="text-5xl font-semibold uppercase">
                {entry.summary[0]}
              </span>
              {entry.summary.slice(1)}
            </p>
            <hr className="mb-6 border-bg-500" />
            <Markdown className="prose !max-w-full">{entry.content}</Markdown>
            <Button
              icon={viewRaw ? 'tabler:chevron-up' : 'tabler:chevron-down'}
              className="mt-6"
              iconAtEnd
              variant="no-bg"
              onClick={() => {
                setViewRaw(!viewRaw)
              }}
            >
              {viewRaw ? 'Hide' : 'Show'} Raw
            </Button>
            {viewRaw && <p className="mt-6 text-lg text-bg-500">{entry.raw}</p>}
          </>
        )}
      </APIComponentWithFallback>
    </Modal>
  )
}

export default JournalViewModal
