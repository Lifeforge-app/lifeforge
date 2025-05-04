import { useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, ModalHeader, TextAreaInput } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { IMomentVaultEntry } from '../interfaces/moment_vault_interfaces'

function ModifyTextEntryModal({
  data: { existedData, queryKey },
  onClose
}: {
  data: {
    existedData: IMomentVaultEntry | null
    queryKey: unknown[]
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  async function onSubmit() {
    if (!existedData) return

    setSubmitLoading(true)

    try {
      await fetchAPI(`moment-vault/entries/${existedData.id}`, {
        method: 'PATCH',
        body: {
          content: text
        }
      })

      queryClient.invalidateQueries({ queryKey })
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to modify text entry')
    } finally {
      setSubmitLoading(false)
    }
  }

  useEffect(() => {
    if (existedData) {
      setText(existedData.content)
    }
  }, [existedData])

  useEffect(() => {
    if (!inputRef.current) return

    inputRef.current.style.height = 'auto'
    inputRef.current.style.height = inputRef.current.scrollHeight + 'px'
  }, [text])

  return (
    <div className="min-w-[50vw]">
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
    </div>
  )
}

export default ModifyTextEntryModal
