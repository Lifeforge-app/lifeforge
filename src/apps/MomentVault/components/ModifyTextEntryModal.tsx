import { t } from 'i18next'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, ModalHeader, ModalWrapper, TextAreaInput } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { IMomentVaultEntry } from '../interfaces/moment_vault_interfaces'

function ModifyTextEntryModal({
  existedEntry,
  onSuccess,
  isOpen,
  onClose
}: {
  existedEntry?: IMomentVaultEntry
  onSuccess: () => void
  isOpen: boolean
  onClose: () => void
}) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmit() {
    if (!existedEntry) return

    setSubmitLoading(true)

    try {
      await fetchAPI(`moment-vault/entries/${existedEntry.id}`, {
        method: 'PATCH',
        body: {
          content: text
        }
      })

      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error('Failed to modify text entry')
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    if (existedEntry) {
      setText(existedEntry.content)
    }
  }, [existedEntry])

  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.style.height = 'auto'
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
  }, [text])

  return (
    <ModalWrapper isOpen={isOpen} minWidth="50vw">
      <ModalHeader
        icon="tabler:pencil"
        namespace="apps.momentVault"
        title="Update Text Entry"
        onClose={onClose}
      />
      <TextAreaInput
        darker
        required
        className="mt-4"
        icon="tabler:file-text"
        name="Text Content"
        namespace="apps.momentVault"
        placeholder={t('apps.momentVault:placeholders.textEntry')}
        setValue={setText}
        value={text}
      />
      <Button
        className="mt-6 w-full"
        disabled={text.trim().length === 0}
        icon="tabler:pencil"
        loading={submitLoading}
        onClick={onSubmit}
      >
        Update
      </Button>
    </ModalWrapper>
  )
}

export default ModifyTextEntryModal
