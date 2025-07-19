import { Button, ModalHeader, QueryWrapper, TextInput } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import { useAPIQuery } from 'shared/lib'
import { ScoresLibraryControllersSchemas } from 'shared/types/controllers'

import ScoreList from './components/ScoreList'

function GuitarWorldModal({ onClose }: { onClose: () => void }) {
  const [cookie, setCookie] = useState('')

  const [finalCookie, setFinalCookie] = useState('')

  const [page, setPage] = useState(1)

  const dataQuery = useAPIQuery<
    ScoresLibraryControllersSchemas.IGuitarWorld['getTabsList']['response']
  >(
    `scores-library/guitar-world?cookie=${finalCookie}&page=${page}`,
    ['scores-library', finalCookie, page],
    !!finalCookie,
    {}
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
            darker
            icon="tabler:cookie"
            name="cookie"
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
