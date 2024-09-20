/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import CreateOrModifyButton from '@components/ButtonsAndInputs/CreateOrModifyButton'
import DateInput from '@components/ButtonsAndInputs/DateInput'
import Input from '@components/ButtonsAndInputs/Input'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import Modal from '@components/Modals/Modal'
import ModalHeader from '@components/Modals/ModalHeader'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import APIRequest from '@utils/fetchData'
import CategorySelector from './ModifyCategoryModal/components/CategorySelector'

interface ModifyEventModalProps {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateEventList: () => void
  existedData: ICalendarEvent | null
  categories: ICalendarCategory[] | 'loading' | 'error'
}

function ModifyEventModal({
  openType,
  setOpenType,
  updateEventList,
  existedData,
  categories
}: ModifyEventModalProps): React.ReactElement {
  const [loading, setLoading] = useState(false)
  const [eventTitle, setEventTitle] = useState('')
  const [eventStartTime, setEventStartTime] = useState('')
  const [eventEndTime, setEventEndTime] = useState('')
  const [eventCategory, setEventCategory] = useState('')
  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false)

  function updateEventTitle(e: React.ChangeEvent<HTMLInputElement>): void {
    setEventTitle(e.target.value)
  }
  const ref = useRef<HTMLInputElement>(null)

  async function onSubmitButtonClick(): Promise<void> {
    if (
      eventTitle.trim().length === 0 ||
      eventStartTime === '' ||
      eventEndTime === ''
    ) {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    setLoading(true)

    const event = {
      title: eventTitle.trim(),
      start: moment(eventStartTime).toISOString(),
      end: moment(eventEndTime).toISOString(),
      category: eventCategory
    }

    await APIRequest({
      endpoint:
        'calendar/event' +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: event,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      finalCallback: () => {
        setLoading(false)
      },
      callback: () => {
        setOpenType(null)
        updateEventList()
      }
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
      <Modal modalRef={ref} isOpen={openType !== null} minWidth="40vw">
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
          actionButtonIcon={
            innerOpenType === 'update' ? 'tabler:trash' : undefined
          }
          actionButtonIsRed
          onActionButtonClick={() => {
            setIsDeleteConfirmationModalOpen(true)
          }}
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
          modalRef={ref}
          date={eventStartTime}
          setDate={setEventStartTime}
          name="Start time"
          icon="tabler:clock"
        />
        <DateInput
          modalRef={ref}
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
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
          type={innerOpenType}
        />
      </Modal>
      <DeleteConfirmationModal
        apiEndpoint="calendar/event"
        isOpen={isDeleteConfirmationModalOpen}
        data={existedData}
        itemName="event"
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false)
        }}
        updateDataList={() => {
          updateEventList()
          setOpenType(null)
        }}
        nameKey="title"
      />
    </>
  )
}

export default ModifyEventModal
