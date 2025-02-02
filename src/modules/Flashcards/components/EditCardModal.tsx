import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { CreateOrModifyButton } from '@components/buttons'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IFlashcardCard } from '@interfaces/flashcard_interfaces'
import APIRequest from '@utils/fetchData'

function EditCardModal({
  deck,
  isOpen,
  onClose,
  cards,
  refreshCards,
  refreshContainerDetails
}: {
  deck: string | undefined
  isOpen: boolean
  onClose: () => void
  cards: IFlashcardCard[]
  refreshCards: () => void
  refreshContainerDetails: () => void
}): React.ReactElement {
  const [innerCards, setInnerCards] = useState<
    Array<
      IFlashcardCard & {
        type: 'update' | 'create' | null
      }
    >
  >(cards.map(card => ({ ...card, type: null })))
  const [loading, setLoading] = useState(false)
  const [currentlyEditingIndex, setCurrentlyEditingIndex] = useState<number>(-1)
  const [toBeDeletedId, setToBeDeletedId] = useState<string[]>([])

  async function onSubmitButtonClick(): Promise<void> {
    const updatedCards = innerCards.filter(card => card.type !== null)

    if (updatedCards.length === 0 && toBeDeletedId.length === 0) {
      toast.error('Please add at least one card.')
      return
    }

    if (innerCards.some(card => card.question.trim().length === 0)) {
      toast.error('Question cannot be empty.')
      return
    }

    if (innerCards.some(card => card.answer.trim().length === 0)) {
      toast.error('Answer cannot be empty.')
      return
    }

    setLoading(true)

    await APIRequest({
      endpoint: 'flashcards/card/update',
      method: 'PUT',
      body: {
        deck,
        cards: updatedCards,
        toBeDeletedId
      },
      successInfo: 'create',
      failureInfo: "Oops! Couldn't update the cards. Please try again.",
      callback: () => {
        onClose()
        refreshCards()
        refreshContainerDetails()
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    // onpaste
    const handlePaste = (e: ClipboardEvent): void => {
      e.preventDefault()
      const text = e.clipboardData?.getData('text')

      if (text === undefined) {
        return
      }

      const lines = text.split('\n')

      let newCards = [...innerCards]

      lines.forEach(line => {
        const [question, answer] = line.split('：')

        newCards.push({
          question,
          answer,
          type: 'create'
        })
      })

      newCards = newCards.filter(
        card =>
          card.question.trim().length !== 0 || card.answer.trim().length !== 0
      )

      setInnerCards(newCards)
    }

    document.addEventListener('paste', handlePaste)

    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [])

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="flex-between mb-8 flex ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon className="size-7" icon="tabler:pencil" />
          Edit Cards
        </h1>
        <button
          className="hover: rounded-md p-2 text-bg-500 transition-all hover:bg-bg-100 dark:hover:bg-bg-800"
          onClick={onClose}
        >
          <Icon className="size-6" icon="tabler:x" />
        </button>
      </div>
      <table className="w-[50vw]">
        <thead>
          <tr className="border-b border-bg-700 ">
            <th className="w-8/12 p-4 text-left font-semibold text-bg-500">
              Question
            </th>
            <th className="w-4/12 p-4 text-left font-semibold text-bg-500">
              Answer
            </th>
            <th className="w-min text-left font-semibold text-bg-500"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-700">
          {innerCards.map((card, index) => (
            <tr key={index}>
              <td className="px-2 py-4 pr-4 ">
                {currentlyEditingIndex === index ? (
                  <input
                    className="w-full rounded-xs border border-bg-700 bg-transparent p-2"
                    type="text"
                    value={card.question}
                    onChange={e => {
                      const newCards = [...innerCards]
                      newCards[index].question = e.target.value
                      newCards[index].type = 'update'
                      setInnerCards(newCards)
                    }}
                  />
                ) : (
                  <button
                    className="w-full p-2 text-left"
                    onClick={() => {
                      setCurrentlyEditingIndex(index)
                    }}
                  >
                    {card.question}
                  </button>
                )}
              </td>
              <td className="pr-6 ">
                {currentlyEditingIndex === index ? (
                  <input
                    className="w-full rounded-xs border border-bg-700 bg-transparent p-2"
                    type="text"
                    value={card.answer}
                    onChange={e => {
                      const newCards = [...innerCards]
                      newCards[index].answer = e.target.value
                      newCards[index].type = 'update'
                      setInnerCards(newCards)
                    }}
                  />
                ) : (
                  <button
                    className="w-full p-2 text-left"
                    onClick={() => {
                      setCurrentlyEditingIndex(index)
                    }}
                  >
                    {card.answer}
                  </button>
                )}
              </td>
              <td className="w-min ">
                <button
                  onClick={() => {
                    if (card.id !== undefined) {
                      setToBeDeletedId([...toBeDeletedId, card.id])
                    }
                    setInnerCards(innerCards.filter((_, i) => i !== index))
                  }}
                >
                  <Icon className="text-xl text-red-500" icon="tabler:trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="flex-center mt-4 hidden w-full gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-50 shadow-custom transition-all hover:bg-bg-800/50 dark:text-bg-50 sm:flex"
        onClick={e => {
          setInnerCards([
            ...innerCards,
            {
              question: '',
              answer: '',
              type: 'create'
            }
          ])
          setCurrentlyEditingIndex(innerCards.length)
          ;(e.target as HTMLButtonElement).scrollIntoView({
            behavior: 'smooth'
          })
        }}
      >
        <Icon className="text-xl" icon="tabler:plus" />
        new card
      </button>

      <div className="mt-12 flex flex-1 flex-col-reverse items-end gap-2 sm:flex-row">
        <button
          className="flex-center h-16 w-full gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-50 shadow-custom transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50"
          disabled={loading}
          onClick={onClose}
        >
          cancel
        </button>
        <CreateOrModifyButton
          loading={loading}
          type={'update'}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        />
      </div>
    </ModalWrapper>
  )
}

export default EditCardModal
