/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin
} from '@mdxeditor/editor'
import React, { useEffect } from 'react'

import '@mdxeditor/editor/style.css'
import { useNavigate, useParams } from 'react-router'
import Button from '@components/ButtonsAndInputs/Button'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import useFetch from '@hooks/useFetch'
import { type IJournalEntry } from '@typedec/Journal'

function JournalView(): React.ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [valid] = useFetch<boolean>(`journal/entry/valid/${id}`)
  const [entry] = useFetch<IJournalEntry>(`journal/entry/get/${id}`)

  useEffect(() => {
    if (valid === false) {
      navigate('/journal')
    }
  }, [valid])

  return (
    <ModuleWrapper>
      <APIComponentWithFallback data={entry}>
        {typeof entry !== 'string' && (
          <>
            <div className="flex items-center justify-between p-3 pb-0">
              <div>
                <GoBackButton
                  onClick={() => {
                    navigate('/journal')
                  }}
                />

                <h2 className="mb-6 text-3xl font-semibold">{entry.title}</h2>
              </div>
              <Button
                onClick={() => {
                  navigate(`/journal/edit/${entry.id}`)
                }}
                icon="tabler:edit"
                className="shrink-0"
              >
                Edit
              </Button>
            </div>
            <MDXEditor
              markdown={entry.content}
              contentEditableClassName="prose max-w-full"
              readOnly
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin()
              ]}
            />
          </>
        )}
      </APIComponentWithFallback>
    </ModuleWrapper>
  )
}

export default JournalView
