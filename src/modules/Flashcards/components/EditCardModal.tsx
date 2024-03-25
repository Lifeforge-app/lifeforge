/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useState } from 'react'
import Modal from '../../../components/general/Modal'
import { Icon } from '@iconify/react/dist/iconify.js'
import { type IFlashcardCard } from './CardSet'
import CreateOrModifyButton from '../../../components/general/CreateOrModifyButton'
import { toast } from 'react-toastify'
import { cookieParse } from 'pocketbase'

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

  function onSubmitButtonClick(): void {
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

    fetch(`${import.meta.env.VITE_API_HOST}/flashcards/card/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      },
      body: JSON.stringify({
        deck,
        cards: updatedCards,
        toBeDeletedId
      })
    })
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        toast.success('Yay! Cards updated.')
        onClose()
        refreshCards()
        refreshContainerDetails()
      })
      .catch(err => {
        toast.error("Oops! Couldn't update the cards. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isOpen}>
      <div className="mb-8 flex items-center justify-between ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon icon="tabler:pencil" className="h-7 w-7" />
          Edit Cards
        </h1>
        <button
          onClick={onClose}
          className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
        >
          <Icon icon="tabler:x" className="h-6 w-6" />
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
              <td className="px-2 py-4 pr-4 text-bg-800 dark:text-bg-100">
                {currentlyEditingIndex === index ? (
                  <input
                    type="text"
                    className="w-full rounded-sm border border-bg-700 bg-transparent p-2"
                    value={card.question}
                    onChange={e => {
                      const newCards = [...innerCards]
                      newCards[index].question = e.target.value
                      newCards[index].type = 'update'
                      setInnerCards(newCards)
                    }}
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => {
                      setCurrentlyEditingIndex(index)
                    }}
                    className="w-full p-2 text-left"
                  >
                    {card.question}
                  </button>
                )}
              </td>
              <td className="pr-6 text-bg-800 dark:text-bg-100">
                {currentlyEditingIndex === index ? (
                  <input
                    type="text"
                    className="w-full rounded-sm border border-bg-700 bg-transparent p-2"
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
                    onClick={() => {
                      setCurrentlyEditingIndex(index)
                    }}
                    className="w-full p-2 text-left"
                  >
                    {card.answer}
                  </button>
                )}
              </td>
              <td className="w-min text-bg-800 dark:text-bg-100">
                <button
                  onClick={() => {
                    if (card.id !== undefined) {
                      setToBeDeletedId([...toBeDeletedId, card.id])
                    }
                    setInnerCards(innerCards.filter((_, i) => i !== index))
                  }}
                >
                  <Icon icon="tabler:trash" className="text-xl text-red-500" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
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
        className="mt-4 hidden w-full items-center justify-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-bg-800/50 dark:text-bg-100 sm:flex"
      >
        <Icon icon="tabler:plus" className="text-xl" />
        new card
      </button>

      <div className="mt-12 flex flex-1 flex-col-reverse items-end gap-2 sm:flex-row">
        <button
          disabled={loading}
          onClick={onClose}
          className="flex h-16 w-full items-center justify-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50"
        >
          cancel
        </button>
        <CreateOrModifyButton
          loading={loading}
          onClick={onSubmitButtonClick}
          type={'update'}
        />
      </div>
    </Modal>
  )
}

export default EditCardModal
