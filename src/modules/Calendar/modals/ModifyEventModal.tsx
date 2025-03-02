import { UseQueryResult } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'

import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import FormModal from '@components/modals/FormModal'
import {
  ICalendarEventFormState,
  type ICalendarCategory,
  type ICalendarEvent
} from '@interfaces/calendar_interfaces'
import { type IFieldProps } from '@interfaces/modal_interfaces'

interface ModifyEventModalProps {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: ICalendarEvent | null
  categoriesQuery: UseQueryResult<ICalendarCategory[]>
}

function ModifyEventModal({
  openType,
  setOpenType,
  existedData,
  categoriesQuery
}: ModifyEventModalProps): React.ReactElement {
  const [formState, setFormState] = useState<ICalendarEventFormState>({
    title: '',
    start: '',
    end: '',
    category: ''
  })
  const ref = useRef<HTMLInputElement>(null)

  const FIELDS: IFieldProps<ICalendarEventFormState>[] = [
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
      options: categoriesQuery.isSuccess
        ? categoriesQuery.data.map(({ name, color, icon, id }) => ({
            value: id,
            text: name,
            icon,
            color
          }))
        : [],
      nullOption: 'tabler:apps-off'
    }
  ]

  const innerOpenType = useDebounce(openType, openType === null ? 300 : 0)
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false)

  useEffect(() => {
    if (innerOpenType === 'update' && existedData !== null) {
      setFormState({
        title: existedData.title,
        start: moment(existedData.start).toISOString(),
        end: moment(existedData.end).toISOString(),
        category: existedData.category
      })
    } else {
      setFormState({
        title: '',
        category: '',
        start: '',
        end: ''
      })

      if (existedData !== null) {
        setFormState({
          title: '',
          category: '',
          start: moment(existedData.start).toISOString(),
          end: moment(existedData.end).toISOString()
        })
      }
    }
  }, [innerOpenType, existedData])

  return (
    <>
      <FormModal
        actionButtonIsRed
        actionButtonIcon="tabler:trash"
        data={formState}
        endpoint="calendar/events"
        fields={FIELDS}
        icon={
          {
            create: 'tabler:plus',
            update: 'tabler:pencil'
          }[innerOpenType!]
        }
        id={existedData?.id}
        isOpen={openType !== null}
        loading={categoriesQuery.isLoading}
        modalRef={ref}
        namespace="modules.calendar"
        openType={openType}
        queryKey={['calendar', 'events']}
        setData={setFormState}
        title={`event.${innerOpenType}`}
        onActionButtonClick={() => {
          setIsDeleteConfirmationModalOpen(true)
        }}
        onClose={() => {
          setOpenType(null)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="calendar/events"
        data={existedData}
        isOpen={isDeleteConfirmationModalOpen}
        itemName="event"
        nameKey="title"
        queryKey={['calendar', 'events']}
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false)
          setOpenType(null)
        }}
      />
    </>
  )
}

export default ModifyEventModal
