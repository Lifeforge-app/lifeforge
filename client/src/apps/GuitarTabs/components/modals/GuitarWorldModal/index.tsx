import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, ModalHeader, TextInput } from '@lifeforge/ui'

import { IGuitarTabsGuitarWorldScores } from '@apps/GuitarTabs/interfaces/guitar_tabs_interfaces'

import fetchAPI from '@utils/fetchAPI'

import ScoreList from './components/ScoreList'

function GuitarWorldModal({ onClose }: { onClose: () => void }) {
  const [cookie, setCookie] = useState('')
  const [proceedLoading, setProceedLoading] = useState(false)
  const [showData, setShowData] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<
    IGuitarTabsGuitarWorldScores | 'loading' | 'error'
  >('loading')

  async function fetchData(page: number) {
    if (cookie.trim() === '') {
      toast.error('Please enter a cookie')
      return
    }

    setData('loading')
    setProceedLoading(true)
    setShowData(true)

    try {
      const data = await fetchAPI<IGuitarTabsGuitarWorldScores>(
        'guitar-tabs/guitar-world',
        {
          method: 'POST',
          body: { cookie, page }
        }
      )

      setData(data)
    } catch {
      toast.error('Failed to fetch scores')
      setData('error')
    } finally {
      setProceedLoading(false)
    }
  }

  useEffect(() => {
    setCookie('')
    setShowData(false)
    setData('loading')
  }, [])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="mingcute:guitar-line"
        namespace="apps.guitarTabs"
        title="Guitar World"
        onClose={onClose}
      />
      {!showData ? (
        <>
          <TextInput
            darker
            icon="tabler:cookie"
            name="cookie"
            namespace="apps.guitarTabs"
            placeholder="Cookie from Guitar World"
            setValue={setCookie}
            value={cookie}
          />
          <Button
            iconAtEnd
            className="mt-4 w-full"
            icon="tabler:arrow-right"
            loading={proceedLoading}
            onClick={() => {
              fetchData(page).catch(console.error)
            }}
          >
            Proceed
          </Button>
        </>
      ) : (
        <ScoreList
          cookie={cookie}
          data={data}
          page={page}
          setPage={(page: number) => {
            setPage(page)
            fetchData(page).catch(console.error)
          }}
        />
      )}
    </div>
  )
}

export default GuitarWorldModal
