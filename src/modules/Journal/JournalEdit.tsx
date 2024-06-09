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
import React, { useEffect, useRef, useState } from 'react'

import '@mdxeditor/editor/style.css'
import { useNavigate, useParams } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IJournalEntry } from '@typedec/Journal'
import APIRequest from '@utils/fetchData'

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

  async function saveJournalEntry(): Promise<void> {
    if (typeof entry !== 'string') {
      if (content === entry.content.trim()) {
        return
      }

      setSaveLoading(true)
      await APIRequest({
        endpoint: `journal/entry/update-content/${entry.id}`,
        method: 'PUT',
        body: { content },
        successInfo: 'Journal entry saved successfully.',
        failureInfo: "Couldn't save journal entry. Please try again.",
        callback: () => {
          setEntry({
            ...entry,
            content: content!
          })
          setSaveLoading(false)
        },
        finalCallback: () => {
          setSaveLoading(false)
        }
      })
    }
  }

  async function saveJournalTitle(): Promise<void> {
    if (typeof entry !== 'string') {
      if (title === entry.title) {
        return
      }

      await APIRequest({
        endpoint: `journal/entry/update-title/${entry.id}`,
        method: 'PATCH',
        body: { title },
        successInfo: 'Journal entry title saved successfully.',
        failureInfo: "Couldn't save journal entry title. Please try again.",
        callback: () => {
          setEntry({
            ...entry,
            title: title!
          })
          setIsTitleUpdating(false)
        },
        finalCallback: () => {
          setIsTitleUpdating(false)
        }
      })
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof entry !== 'string' && content !== entry.content.trim()) {
        saveJournalEntry().catch(console.error)
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
                      <button
                        onClick={() => {
                          saveJournalTitle().catch(console.error)
                        }}
                      >
                        <Icon icon="uil:save" className="size-5 text-bg-500" />
                      </button>
                      <button
                        onClick={() => {
                          setIsTitleUpdating(false)
                        }}
                      >
                        <Icon icon="tabler:x" className="size-5 text-bg-500" />
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
                          className="size-5 text-bg-500"
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {content !== entry.content.trim() && (
                <Button
                  icon={saveLoading ? 'svg-spinners:180-ring' : 'uil:save'}
                  onClick={() => {
                    saveJournalEntry().catch(console.error)
                  }}
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
