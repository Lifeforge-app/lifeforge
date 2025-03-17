import { UseQueryResult } from '@tanstack/react-query'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

import { DeleteConfirmationModal, FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import {
  type ICalendarCategory,
  type ICalendarEvent,
  ICalendarEventFormState
} from '../interfaces/calendar_interfaces'

interface ModifyEventModalProps {
  openType: 'create' | 'update' | null
  setOpenType: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  existedData: ICalendarEvent | null
  categoriesQuery: UseQueryResult<ICalendarCategory[]>
  eventQueryKey: unknown[]
}

function ModifyEventModal({
  openType,
  setOpenType,
  existedData,
  categoriesQuery,
  eventQueryKey
}: ModifyEventModalProps) {
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
      required: true,
      label: 'Event title',
      icon: 'tabler:calendar',
      type: 'text',
      placeholder: 'My event'
    },
    {
      id: 'start',
      required: true,
      label: 'Start time',
      icon: 'tabler:clock',
      type: 'datetime',
      index: 0,
      modalRef: ref
    },
    {
      id: 'end',
      required: true,
      label: 'End time',
      icon: 'tabler:clock',
      type: 'datetime',
      index: 1,
      modalRef: ref
    },
    {
      id: 'category',
      required: true,
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

  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false)

  useEffect(() => {
    if (openType === 'update' && existedData !== null) {
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
  }, [openType, existedData])

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
          }[openType!]
        }
        id={existedData?.id}
        isOpen={openType !== null}
        loading={categoriesQuery.isLoading}
        modalRef={ref}
        namespace="modules.calendar"
        openType={openType}
        queryKey={['calendar', 'events']}
        setData={setFormState}
        title={`event.${openType}`}
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
        queryKey={eventQueryKey}
        onClose={() => {
          setIsDeleteConfirmationModalOpen(false)
          setOpenType(null)
        }}
      />
    </>
  )
}

export default ModifyEventModal
