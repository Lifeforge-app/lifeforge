/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import { useDebounce } from '@uidotdev/usehooks'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/CreateOrModifyButton'
import DateInput from '@components/DateInput'
import Input from '@components/Input'
import Modal from '@components/Modal'
import ModalHeader from '@components/ModalHeader'
import { type ICalendarCategory, type ICalendarEvent } from '@typedec/Calendar'
import CategorySelector from './ModifyCategoryModal/components/CategorySelector'

function ModifyEventModal({
  openType,
  setOpenType,
  updateEventList,
  existedData,
  categories
}: {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateEventList: () => void
  existedData: ICalendarEvent | null
  categories: ICalendarCategory[] | 'loading' | 'error'
}): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventStartTime, setEventStartTime] = useState('')
  const [eventEndTime, setEventEndTime] = useState('')
  const [eventCategory, setEventCategory] = useState('')
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)

  function updateEventTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    setEventTitle(e.target.value)
  }

  function onSubmitButtonClick(): void {
    if (
      eventTitle.trim().length === 0 ||
      eventStartTime === '' ||
      eventEndTime === ''
    ) {
      toast.error('Please fill in all the fields.')
      return
    }

    setLoading(true)

    const event = {
      title: eventTitle.trim(),
      start: moment(eventStartTime).toISOString(),
      end: moment(eventEndTime).toISOString(),
      category: eventCategory
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/calendar/event/${innerOpenType}` +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      {
        method: innerOpenType === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify(event)
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success(
          {
            create: 'Yay! Event created.',
            update: 'Yay! Event updated.'
          }[innerOpenType!]
        )
        setOpenType(null)
        updateEventList()
      })
      .catch(err => {
        toast.error(
          {
            create: "Oops! Couldn't create the event. Please try again.",
            update: "Oops! Couldn't update the event. Please try again."
          }[innerOpenType!]
        )
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (innerOpenType === 'update' && existedData !== null) {
      setEventTitle(existedData.title)
      setEventStartTime(moment(existedData.start).toISOString())
      setEventEndTime(moment(existedData.end).toISOString())
      setEventCategory(existedData.category)
    } else {
      setEventTitle('')
      if (existedData !== null) {
        setEventStartTime(moment(existedData.start).toISOString())
        setEventEndTime(moment(existedData.end).toISOString())
      }
      setEventCategory('')
    }
  }, [innerOpenType, existedData])

  return (
    <>
      <Modal isOpen={openType !== null} minWidth="40vw">
        <ModalHeader
          icon={
            {
              create: 'tabler:plus',
              update: 'tabler:pencil'
            }[innerOpenType!]
          }
          title={`${
            {
              create: 'Create ',
              update: 'Update '
            }[innerOpenType!]
          } event`}
          onClose={() => {
            setOpenType(null)
          }}
        />
        <Input
          name="Event title"
          icon="tabler:calendar"
          value={eventTitle}
          updateValue={updateEventTitle}
          darker
          placeholder="My event"
        />
        <DateInput
          date={eventStartTime}
          setDate={setEventStartTime}
          name="Start time"
          icon="tabler:clock"
        />
        <DateInput
          date={eventEndTime}
          setDate={setEventEndTime}
          name="End time"
          icon="tabler:clock"
        />
        <CategorySelector
          categories={categories}
          category={eventCategory}
          setCategory={setEventCategory}
        />
        <CreateOrModifyButton
          loading={loading}
          onClick={onSubmitButtonClick}
          type={innerOpenType}
        />
      </Modal>
    </>
  )
}

export default ModifyEventModal
