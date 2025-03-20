import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { Button, ModalHeader, ModalWrapper, TextInput } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { type IGuitarTabsGuitarWorldScores } from '../../interfaces/guitar_tabs_interfaces'
import ScoreList from './components/ScoreList'

function GuitarWorldModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
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
    if (!isOpen) {
      setCookie('')
      setShowData(false)
      setData('loading')
    }
  }, [isOpen])

  return (
    <ModalWrapper isOpen={isOpen} minWidth="50vw">
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
            className="mt-4"
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
    </ModalWrapper>
  )
}

export default GuitarWorldModal
