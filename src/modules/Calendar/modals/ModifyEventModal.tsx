import { useDebounce } from '@uidotdev/usehooks'

import moment from 'moment'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import Modal from '@components/modals/Modal'
import ErrorScreen from '@components/screens/ErrorScreen'
import LoadingScreen from '@components/screens/LoadingScreen'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import { type Loadable } from '@interfaces/common'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import APIRequest from '@utils/fetchData'

interface ModifyEventModalProps {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  updateEventList: () => void
  existedData: ICalendarEvent | null
  categories: Loadable<ICalendarCategory[]>
}

function ModifyEventModal({
  openType,
  setOpenType,
  updateEventList,
  existedData,
  categories
}: ModifyEventModalProps): React.ReactElement {
  const { t } = useTranslation('modules.calendar')

  const [data, setData] = useReducer(
    (state, _newState) => {
      const newState = { ...state, ..._newState }

      if (newState.start > newState.end) {
        newState.end = newState.start
      }

      return newState
    },
    {
      title: '',
      start: '',
      end: '',
      category: ''
    }
  )
  const ref = useRef<HTMLInputElement>(null)

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'title',
      label: 'Event title',
      icon: 'tabler:calendar',
      type: 'text',
      placeholder: 'My event'
    },
    {
      id: 'start',
      label: 'Start time',
      icon: 'tabler:clock',
      type: 'date',
      index: 0,
      modalRef: ref
    },
    {
      id: 'end',
      label: 'End time',
      icon: 'tabler:clock',
      type: 'date',
      index: 1,
      modalRef: ref
    },
    {
      id: 'category',
      label: 'Event Category',
      icon: 'tabler:list',
      type: 'listbox',
      options:
        typeof categories === 'string'
          ? []
          : categories.map(({ name, color, icon, id }) => ({
              value: id,
              text: name,
              icon,
              color
            })),
      nullOption: 'tabler:apps-off'
    }
  ]

  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false)

  async function onSubmitButtonClick(): Promise<void> {
    const { title, start, end, category } = data

    if (title.trim().length === 0 || start === '' || end === '') {
      toast.error(t('input.error.fieldEmpty'))
      return
    }

    const event = {
      title: title.trim(),
      start: moment(start).toISOString(),
      end: moment(end).toISOString(),
      category
    }

    await APIRequest({
      endpoint:
        'calendar/event' +
        (innerOpenType === 'update' ? `/${existedData?.id}` : ''),
      method: innerOpenType === 'create' ? 'POST' : 'PATCH',
      body: event,
      successInfo: innerOpenType,
      failureInfo: innerOpenType,
      callback: () => {
        setOpenType(null)
        updateEventList()
      }
    })
  }

  useEffect(() => {
    if (innerOpenType === 'update' && existedData !== null) {
      setData({
        title: existedData.title,
        start: moment(existedData.start).toISOString(),
        end: moment(existedData.end).toISOString(),
        category: existedData.category
      })
    } else {
      setData({
        title: '',
        category: ''
      })

      if (existedData !== null) {
        setData({
          start: moment(existedData.start).toISOString(),
          end: moment(existedData.end).toISOString()
        })
      }
    }
  }, [innerOpenType, existedData])

  if (categories === 'loading') return <LoadingScreen />
  if (categories === 'error') {
    return <ErrorScreen message="Failed to fetch data" />
  }

  return (
    <>
      <Modal
        actionButtonIsRed
        actionButtonIcon="tabler:trash"
        data={data}
        fields={FIELDS}
        icon={
          {
            create: 'tabler:plus',
            update: 'tabler:pencil'
          }[innerOpenType!]
        }
        isOpen={openType !== null}
        modalRef={ref}
        namespace="modules.calendar"
        openType={openType}
        setData={setData}
        title={`event.${innerOpenType}`}
        onActionButtonClick={() => {
          setIsDeleteConfirmationModalOpen(true)
        }}
        onClose={() => {
          setOpenType(null)
        }}
        onSubmit={onSubmitButtonClick}
      />
      <DeleteConfirmationModal
        apiEndpoint="calendar/event"
        data={existedData}
        isOpen={isDeleteConfirmationModalOpen}
        itemName="event"
        nameKey="title"
        updateDataLists={() => {
          updateEventList()
          setOpenType(null)
        }}
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false)
        }}
      />
    </>
  )
}

export default ModifyEventModal
