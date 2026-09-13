import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { type InferOutput, usePromiseLoading } from '@lifeforge/api'
import {
  Box,
  Button,
  LoadingScreen,
  ModalHeader,
  Stack,
  TextInput,
  toast
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

export type TGVImportedTicketData = Exclude<
  InferOutput<typeof forgeAPI.tgv.fetchTicket>,
  false
>

function TGVLoginModal({
  onClose,
  data: { tgvId, onImport }
}: {
  onClose: () => void
  data: { tgvId: string; onImport: (data: TGVImportedTicketData) => void }
}) {
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')

  const sessionQuery = useQuery(
    forgeAPI.tgv.hasCachedSession.queryOptions({
      staleTime: 0,
      refetchOnMount: 'always'
    })
  )

  const fetchTicketMutation = useMutation(
    forgeAPI.tgv.fetchTicket.mutationOptions({
      onSuccess: (result: TGVImportedTicketData | false) => {
        if (result === false) {
          toast.error('No ticket found')
        } else {
          onImport(result)
          onClose()
        }
      },
      onError: (error: unknown) => {
        toast.error((error as Error).message || 'Failed to fetch ticket')
      }
    })
  )

  useEffect(() => {
    if (sessionQuery.data === true && fetchTicketMutation.isIdle) {
      fetchTicketMutation.mutate({ tgvId })
    }
  }, [sessionQuery.data, tgvId, fetchTicketMutation])

  const [loading, onSubmit] = usePromiseLoading(() =>
    fetchTicketMutation.mutateAsync({ email, pin, tgvId })
  )

  if (
    sessionQuery.isLoading ||
    sessionQuery.data === undefined ||
    fetchTicketMutation.isPending
  ) {
    return <LoadingScreen />
  }

  return (
    <Box minWidth="24rem">
      <ModalHeader
        icon="tabler:cloud-download"
        title="importFromTgv"
        onClose={onClose}
      />
      <Stack gap="sm" mt="lg">
        <TextInput
          icon="tabler:mail"
          inputMode="email"
          label="Email"
          placeholder="john.doe@gmail.com"
          value={email}
          onChange={setEmail}
        />
        <TextInput
          isPassword
          icon="tabler:lock"
          label="PIN"
          placeholder="123456"
          value={pin}
          onChange={setPin}
        />
      </Stack>
      <Button
        icon="tabler:arrow-right"
        iconPosition="end"
        loading={loading}
        mt="lg"
        width="100%"
        onClick={onSubmit}
      >
        submit
      </Button>
    </Box>
  )
}

export default TGVLoginModal
