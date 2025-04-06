import { Icon } from '@iconify/react/dist/iconify.js'
import dayjs from 'dayjs'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import {
  Button,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModalHeader,
  ModalWrapper,
  QueryWrapper
} from '@lifeforge/ui'

import { ICalendarCategory } from '@apps/Calendar/interfaces/calendar_interfaces'
import { IMovieEntry } from '@apps/Movies/interfaces/movies_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

function ShowTicketModal({
  isOpen,
  onClose,
  entry
}: {
  isOpen: boolean
  onClose: (added: boolean) => void
  entry: IMovieEntry | undefined
}) {
  const [addToCalendarLoading, setAddToCalendarLoading] = useState(false)
  const [addedToCalendar, setAddedToCalendar] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showCategoriesSelector, setShowCategoriesSelector] = useState(false)
  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories'],
    showCategoriesSelector
  )

  async function addToCalendar() {
    if (!entry) {
      toast.error('No entry found!')
      return
    }

    if (!selectedCategory) {
      toast.error('Please select a category!')
      return
    }

    setAddToCalendarLoading(true)
    try {
      await fetchAPI(
        `movies/entries/ticket/calendar/${entry.id}?category=${selectedCategory}`,
        {
          method: 'POST'
        }
      )

      toast.success('Event added to calendar')
      setAddedToCalendar(true)
      setShowCategoriesSelector(false)
      setSelectedCategory('')
      setAddToCalendarLoading(false)
    } catch (error) {
      toast.error('An error occurred while adding to calendar')
      console.error('Error adding to calendar:', error)
    } finally {
      setAddToCalendarLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && entry) {
      setAddedToCalendar(!!entry.calendar_record)
    }
  }, [isOpen, entry])

  return (
    <ModalWrapper isOpen={isOpen} maxWidth="20rem">
      <ModalHeader
        icon="tabler:ticket"
        namespace="apps.movies"
        title="ticket.view"
        onClose={() => {
          onClose(addedToCalendar !== !!entry?.calendar_record)
        }}
      />
      {entry && (
        <>
          <div className="flex aspect-square h-auto w-full items-center justify-center rounded-lg bg-white p-8">
            <QRCodeSVG className="h-full w-full" value={entry.ticket_number} />,
          </div>
          <h2 className="mt-6 text-xl font-medium">{entry.title}</h2>
          <div className="text-bg-500 mt-6 space-y-4">
            <div className="flex items-center gap-2">
              <Icon className="size-5 shrink-0" icon="tabler:map-pin" />
              {entry.theatre_location}
            </div>
            <div className="flex items-center gap-2">
              <Icon className="size-5 shrink-0" icon="tabler:calendar" />
              {dayjs(entry.theatre_showtime).format('DD MMM YYYY, h:mm a')}
            </div>
            <div className="flex items-center gap-2">
              <Icon className="size-5 shrink-0" icon="tabler:hash" />
              Theatre No. {entry.theatre_number}
            </div>
            <div className="flex items-center gap-2">
              <Icon className="size-5 shrink-0" icon="mdi:love-seat-outline" />
              {entry.theatre_seat}
            </div>
            {!addedToCalendar ? (
              <>
                {showCategoriesSelector ? (
                  <QueryWrapper query={categoriesQuery}>
                    {categories => (
                      <>
                        <ListboxOrComboboxInput
                          required
                          buttonContent={
                            <>
                              <Icon
                                className="mr-2 size-4"
                                icon={
                                  categories.find(
                                    c => c.id === selectedCategory
                                  )?.icon ?? ''
                                }
                                style={{
                                  color:
                                    categories.find(
                                      c => c.id === selectedCategory
                                    )?.color ?? ''
                                }}
                              />
                              <span className="-mt-px block truncate">
                                {categories.find(c => c.id === selectedCategory)
                                  ?.name ?? 'Select category'}
                              </span>
                            </>
                          }
                          icon="tabler:list"
                          name="Category"
                          namespace="apps.movies"
                          setValue={setSelectedCategory}
                          type="listbox"
                          value={selectedCategory}
                        >
                          {categories.map(({ name, color, id, icon }) => (
                            <ListboxOrComboboxOption
                              key={id}
                              color={color}
                              icon={icon}
                              text={name}
                              value={id}
                            />
                          ))}
                        </ListboxOrComboboxInput>
                        <Button
                          iconAtEnd
                          className="mt-4 w-full"
                          icon="tabler:arrow-right"
                          loading={addToCalendarLoading}
                          onClick={() => {
                            addToCalendar()
                          }}
                        >
                          Proceed
                        </Button>
                        <Button
                          className="mt-2 w-full"
                          icon="tabler:x"
                          namespace="apps.movies"
                          variant="secondary"
                          onClick={() => {
                            setShowCategoriesSelector(false)
                            setSelectedCategory('')
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </QueryWrapper>
                ) : (
                  <Button
                    className="mt-8 w-full"
                    icon="tabler:calendar"
                    loading={addToCalendarLoading}
                    namespace="apps.movies"
                    variant="secondary"
                    onClick={() => {
                      setShowCategoriesSelector(true)
                    }}
                  >
                    Add to Calendar
                  </Button>
                )}
              </>
            ) : (
              <Button
                disabled
                className="mt-8 w-full"
                icon="tabler:check"
                namespace="apps.movies"
                variant="tertiary"
              >
                Added to Calendar
              </Button>
            )}
          </div>
        </>
      )}
    </ModalWrapper>
  )
}

export default ShowTicketModal
