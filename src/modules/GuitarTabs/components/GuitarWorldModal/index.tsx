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
      setCookie(
        'remember_web_cda0695f5f0a49e07bde136b0c83d5548b88d10f=eyJpdiI6IlV1Mjg5NnJ3MGdDSSs4NzBMM1NNb1E9PSIsInZhbHVlIjoid0NXQVRzNnN0WThKbjlEVm5jaGZMRkhQZCtpUVwvTXpMV1p2andcL3lZWVpvS3BMdnhjRlErOXFOb1VEaFlUaG1oSGF0NGxETVFMOWpseFJZbUo3cjdGdmxxbFVnM29pZjRMVU8wUE1JeHg4MUJBeTBSUWhhUTUxdFJ2N0hkeVAraW9ER2xpRjI2bWtWWjlGNW02ajM3QldFcEx5NHBLMjBBNUdMMjRzVVYwMkhBSHlDQzMxSzU3QXc4K1VuQmUwVUwiLCJtYWMiOiI2MmMwNDIzNTcwNzNmODA0NzAyMjRkNzVkMTZjZjM2MWE3NWU3ZmMyMDE3ZWZmODI3NzdmNjgzOWNhMGVhODU0In0%3D; XSRF-TOKEN=eyJpdiI6Im9ZTXNFRmhZbEgyR1kwNWV6ajM2RWc9PSIsInZhbHVlIjoiXC9GYmVPc1wvdFVlK05GUUJPaklseGc1SGllSlJPaSs2VzFEZERSUFdndlluaG56NHB5cjE2V0pQS1RCdER0cmFvN1wvUDNOM1ZKYnk1bjJibzFHa3lITEpxeGh2ZmdYTVUrd3I1WVhaTEdOYkZNZDUrS2ZEMFA3NzJjVDNcL2xBcitnIiwibWFjIjoiYjdhNjAxYmIyMDliZjBhNWNkZmUyMmFiMjNmYzg4ZWI0MTY4OWQxOThhZDgwMmRiZjBhMzFiYjcwMTQwZmFkYSJ9; guitarworld_ses=eyJpdiI6Inp5aUlGYlpQNFdaSjRwa01VOGJPQXc9PSIsInZhbHVlIjoiSmdOdGxleTVnSDBmN2FVelZqUGk3U0w2OXRycE83SFNKVURNU25WbU9NRWZsTTJuNGdnOGpLTWhlMitOaUk5RFwvNUcyTitQTHpzdXZzc3JiWW5QWW1cL051Zk1zTkhQNjZhU1pOSkRWUGxHYWZnY0huRUV5dUJnZENlTG4rTVhXQiIsIm1hYyI6IjZiNDQxNmJmNzQ2ZWUzMGQ2ZjU3ZDUzODYyNTdkNTFlZGZmYmZhYmNmYWU2MmFiNWVhYWU3Zjk1NDk4NjQ0ODQifQ%3D%3D; __cf_bm=xfJBwhaL4_vZjbq37QNmxAERjcWzpTUbq9hN4hb_hqg-1732095429-1.0.1.1-2ERpWkUPk0bECcq2.3l6WtoC_BC.H54sbE4_dTsrYFwxrcJASDjqPXw3k19UD1kfF56DypVp4Uus4Kyjv94Ttw'
      )
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
