/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useDebounce } from '@uidotdev/usehooks'
import { t } from 'i18next'
import moment from 'moment'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import Modal from '@components/Modals/Modal'
import ErrorScreen from '@components/Screens/ErrorScreen'
import LoadingScreen from '@components/Screens/LoadingScreen'
import {
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'
import APIRequest from '@utils/fetchData'

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
  if (categories === 'loading') return <LoadingScreen />
  if (categories === 'error') {
    return <ErrorScreen message="Failed to fetch data" />
  }

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

  const FIELDS: IFieldProps[] = [
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
      label: 'Category',
      icon: 'tabler:list',
      type: 'listbox',
      options: categories.map(({ name, color, icon, id }) => ({
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

  return (
    <>
      <Modal
        isOpen={openType !== null}
        modalRef={ref}
        openType={openType}
        onClose={() => {
          setOpenType(null)
        }}
        onSubmit={onSubmitButtonClick}
        title={`${
          {
            create: 'Create ',
            update: 'Update '
          }[innerOpenType!]
        } event`}
        icon={
          {
            create: 'tabler:plus',
            update: 'tabler:pencil'
          }[innerOpenType!]
        }
        fields={FIELDS}
        data={data}
        setData={setData}
        actionButtonIcon="tabler:trash"
        actionButtonIsRed
        onActionButtonClick={() => {
          setIsDeleteConfirmationModalOpen(true)
        }}
      />
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
