/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react'
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  markdownShortcutPlugin
} from '@mdxeditor/editor'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useRef, useState } from 'react'

import '@mdxeditor/editor/style.css'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import Button from '@components/Button'
import GoBackButton from '@components/GoBackButton'
import ModuleWrapper from '@components/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import { type IJournalEntry } from '@typedec/Journal'

function JournalEdit(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [valid] = useFetch<boolean>(`journal/entry/valid/${id}`)
  const [entry, , setEntry] = useFetch<IJournalEntry>(`journal/entry/get/${id}`)
  const [saveLoading, setSaveLoading] = useState(false)
  const [isTitleUpdating, setIsTitleUpdating] = useState(false)
  const titleEditInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (valid === false) {
      navigate('/journal')
    }
  }, [valid])

  const [title, setTitle] = useState<string | null>(null)
  const [content, setContent] = useState<string | null>(null)

  useEffect(() => {
    if (typeof entry !== 'string') {
      setContent(entry.content.trim())
      setTitle(entry.title)
    }
  }, [entry])

  function saveJournalEntry(): void {
    if (typeof entry !== 'string') {
      if (content === entry.content.trim()) {
        return
      }

      setSaveLoading(true)

      fetch(
        `${import.meta.env.VITE_API_HOST}/journal/entry/update-content/${
          entry.id
        }`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          },
          body: JSON.stringify({ content })
        }
      )
        .then(async res => {
          const data = await res.json()
          if (!res.ok) {
            throw data.message
          }

          setEntry({
            ...entry,
            content: content!
          })
          toast.success('Journal entry saved successfully.')
        })
        .catch(err => {
          toast.error("Couldn't save journal entry. Please try again.")
          console.error(err)
        })
        .finally(() => {
          setSaveLoading(false)
        })
    }
  }

  function saveJournalTitle(): void {
    if (typeof entry !== 'string') {
      if (title === entry.title) {
        return
      }

      fetch(
        `${import.meta.env.VITE_API_HOST}/journal/entry/update-title/${
          entry.id
        }`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          },
          body: JSON.stringify({ title })
        }
      )
        .then(async res => {
          const data = await res.json()
          if (!res.ok) {
            throw data.message
          }

          setEntry({
            ...entry,
            title: title!
          })
          setIsTitleUpdating(false)
          toast.success('Journal entry title saved successfully.')
        })
        .catch(err => {
          toast.error("Couldn't save journal entry title. Please try again.")
          console.error(err)
        })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof entry !== 'string' && content !== entry.content.trim()) {
        saveJournalEntry()
      }
    }, 10 * 60 * 1000)

    return () => {
      clearInterval(interval)
    }
  })

  return (
    <ModuleWrapper>
      <APIComponentWithFallback data={entry}>
        {typeof entry !== 'string' && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <GoBackButton
                  onClick={() => {
                    if (content === entry.content.trim()) {
                      navigate('/journal')
                    } else {
                      if (
                        window.confirm(
                          'You have unsaved changes. Are you sure you want to leave?'
                        )
                      ) {
                        navigate('/journal')
                      }
                    }
                  }}
                />
                <div className="mb-6 flex items-center gap-4">
                  {isTitleUpdating ? (
                    <>
                      <input
                        ref={titleEditInputRef}
                        type="text"
                        value={title ?? ''}
                        onChange={e => {
                          setTitle(e.target.value)
                        }}
                        className="rounded-sm bg-transparent p-2 text-3xl font-semibold outline outline-2 outline-bg-500 focus:outline"
                      />
                      <button onClick={saveJournalTitle}>
                        <Icon icon="uil:save" className="h-5 w-5 text-bg-500" />
                      </button>
                      <button
                        onClick={() => {
                          setIsTitleUpdating(false)
                        }}
                      >
                        <Icon icon="tabler:x" className="h-5 w-5 text-bg-500" />
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="p-2 text-3xl font-semibold">
                        {entry.title}
                      </h2>
                      <button
                        onClick={() => {
                          setIsTitleUpdating(true)
                          setTimeout(() => {
                            if (titleEditInputRef.current !== null) {
                              titleEditInputRef.current.focus()
                            }
                          }, 50)
                        }}
                      >
                        <Icon
                          icon="tabler:pencil"
                          className="h-5 w-5 text-bg-500"
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {content !== entry.content.trim() && (
                <Button
                  icon={saveLoading ? 'svg-spinners:180-ring' : 'uil:save'}
                  onClick={saveJournalEntry}
                  className="shrink-0"
                >
                  Save
                </Button>
              )}
            </div>
            {content !== null && (
              <MDXEditor
                markdown={content}
                onChange={setContent}
                contentEditableClassName="prose max-w-full"
                plugins={[
                  headingsPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                  markdownShortcutPlugin(),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        {' '}
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                      </>
                    )
                  })
                ]}
              />
            )}
          </>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default JournalEdit
