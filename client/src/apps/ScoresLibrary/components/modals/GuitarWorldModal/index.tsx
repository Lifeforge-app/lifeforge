import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { Button, ModalHeader, QueryWrapper, TextInput } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import type { InferOutput } from 'shared'

import ScoreList from './components/ScoreList'

export type ScoreLibraryGuitarWorldResponse = InferOutput<
  typeof forgeAPI.scoresLibrary.guitarWorld.list
>

function GuitarWorldModal({ onClose }: { onClose: () => void }) {
  const [cookie, setCookie] = useState('')

  const [finalCookie, setFinalCookie] = useState('')

  const [page, setPage] = useState(1)

  const dataQuery = useQuery(
    forgeAPI.scoresLibrary.guitarWorld.list
      .input({ cookie: finalCookie, page })
      .queryOptions({
        enabled: !!finalCookie
      })
  )

  useEffect(() => {
    setCookie('')
    setFinalCookie('')
    setPage(1)
  }, [])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="mingcute:guitar-line"
        namespace="apps.scoresLibrary"
        title="Guitar World"
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
