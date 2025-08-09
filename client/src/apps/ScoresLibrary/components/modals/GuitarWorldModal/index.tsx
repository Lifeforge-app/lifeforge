import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  Button,
  ConfirmationModal,
  ModalHeader,
  QueryWrapper,
  TextInput,
  useModalStore
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'

import ScoreList from './components/ScoreList'

export type ScoreLibraryGuitarWorldResponse = InferOutput<
  typeof forgeAPI.scoresLibrary.guitarWorld.list
>

function GuitarWorldModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const [cookie, setCookie] = useState(
    localStorage.getItem('guitarWorldCookie') || ''
  )

  const [finalCookie, setFinalCookie] = useState(
    localStorage.getItem('guitarWorldCookie') || ''
  )

  const [page, setPage] = useState(1)

  const dataQuery = useQuery(
    forgeAPI.scoresLibrary.guitarWorld.list
      .input({ cookie: finalCookie, page })
      .queryOptions({
        enabled: !!finalCookie
      })
  )

  useEffect(() => {
    if (!dataQuery.data) return
    if (localStorage.getItem('guitarWorldCookie') === finalCookie) return

    localStorage.setItem('guitarWorldCookie', finalCookie)

    toast.info('Guitar World session cookie saved')
  }, [finalCookie, dataQuery.data])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        actionButtonIsRed
        actionButtonIcon={finalCookie && 'tabler:cookie-off'}
        icon="mingcute:guitar-line"
        namespace="apps.scoresLibrary"
        title="Guitar World"
        onActionButtonClick={() => {
          open(ConfirmationModal, {
            title: 'Remove session cookie',
            description:
              'Are you sure you want to remove the Guitar World session cookie? You will have to re-enter it.',
            onConfirm: async () => {
              setFinalCookie('')
              setCookie('')
              localStorage.removeItem('guitarWorldCookie')
            }
          })
        }}
        onClose={onClose}
      />
      {!finalCookie ? (
        <>
          <TextInput
            icon="tabler:cookie"
            label="cookie"
            namespace="apps.scoresLibrary"
            placeholder="Cookie from Guitar World"
            setValue={setCookie}
            value={cookie}
          />
          <Button
            iconAtEnd
            className="mt-4 w-full"
            icon="tabler:arrow-right"
            onClick={() => {
              setFinalCookie(cookie)
            }}
          >
            Proceed
          </Button>
        </>
      ) : (
        <QueryWrapper query={dataQuery}>
          {data => (
            <ScoreList
              cookie={cookie}
              data={data}
              page={page}
              setPage={setPage}
            />
          )}
        </QueryWrapper>
      )}
    </div>
  )
}

export default GuitarWorldModal
