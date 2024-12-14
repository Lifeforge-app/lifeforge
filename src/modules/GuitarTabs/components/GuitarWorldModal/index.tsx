import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/ButtonsAndInputs/Button'
import Input from '@components/ButtonsAndInputs/Input'
import ModalHeader from '@components/Modals/ModalHeader'
import ModalWrapper from '@components/Modals/ModalWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { type IGuitarTabsGuitarWorldScores } from '@interfaces/guitar_tabs_interfaces'
import APIRequest from '@utils/fetchData'
import ScoreList from './components/ScoreList'

function GuitarWorldModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}): React.ReactElement {
  const [cookie, setCookie] = useState('')
  const [proceedLoading, setProceedLoading] = useState(false)
  const [showData, setShowData] = useState(false)
  const [page, setPage] = useState(1)
  const [data, setData] = useState<
    'loading' | 'error' | IGuitarTabsGuitarWorldScores
  >('loading')

  async function fetchData(page: number): Promise<void> {
    if (cookie.trim() === '') {
      toast.error('Please enter a cookie')
      return
    }

    setData('loading')
    setProceedLoading(true)
    setShowData(true)

    await APIRequest({
      endpoint: 'guitar-tabs/guitar-world',
      method: 'POST',
      body: { cookie, page },
      callback: data => {
        setData(data.data)
      },
      onFailure() {
        setData('error')
      },
      finalCallback() {
        setProceedLoading(false)
      }
    })
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
        onClose={onClose}
        title="Guitar World"
        icon="mingcute:guitar-line"
      />
      {!showData ? (
        <>
          <Input
            icon="tabler:cookie"
            value={cookie}
            updateValue={setCookie}
            name="cookie"
            placeholder="Cookie from Guitar World"
            darker
          />
          <Button
            loading={proceedLoading}
            icon="tabler:arrow-right"
            iconAtEnd
            onClick={() => {
              fetchData(page).catch(console.error)
            }}
            className="mt-4"
          >
            Proceed
          </Button>
        </>
      ) : (
        <APIComponentWithFallback data={data}>
          {data => (
            <ScoreList
              data={data}
              page={page}
              setPage={(page: number) => {
                setPage(page)
                fetchData(page).catch(console.error)
              }}
              cookie={cookie}
            />
          )}
        </APIComponentWithFallback>
      )}
    </ModalWrapper>
  )
}

export default GuitarWorldModal
