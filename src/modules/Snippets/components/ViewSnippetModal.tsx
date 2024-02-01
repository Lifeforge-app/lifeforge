/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useContext, useState } from 'react'
import Modal from '../../../components/general/Modal'
import { type ICodeSnippetsEntry } from '..'
import Loading from '../../../components/general/Loading'
import { Icon } from '@iconify/react/dist/iconify.js'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { atomone } from '@uiw/codemirror-theme-atomone'
import { materialLight } from '@uiw/codemirror-theme-material'
import { Link } from 'react-router-dom'
import { PersonalizationContext } from '../../../providers/PersonalizationProvider'
import useFetch from '../../../hooks/useFetch'

function ViewSnippetModal({
  snippetId
}: {
  snippetId: string | undefined
}): React.ReactElement {
  const [data] = useFetch<ICodeSnippetsEntry | 'loading' | 'error'>(
    `code-snippets/entry/get/${snippetId}`,
    snippetId !== undefined
  )
  const [codeCopied, setCodeCopied] = useState(false)
  const { theme } = useContext(PersonalizationContext)

  async function copyCode(): Promise<void> {
    if (typeof data !== 'string' && data.code !== undefined) {
      await navigator.clipboard.writeText(data.code)
      setCodeCopied(true)

      setTimeout(() => {
        setCodeCopied(false)
      }, 2000)
    }
  }

  return (
    <Modal isOpen={snippetId !== undefined}>
      {(() => {
        switch (data) {
          case 'loading':
            return <Loading />
          case 'error':
            return (
              <div className="flex flex-col gap-2">
                <span className="text-2xl">Error</span>
                <span>Failed to fetch data from server.</span>
              </div>
            )
          default:
            return (
              <div className="flex h-full min-h-0 flex-col gap-2">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold">{data.title}</h1>
                    <span className="text-neutral-500 dark:text-neutral-400">
                      {data.description}
                    </span>
                  </div>
                  <Link
                    to="/snippets"
                    className="rounded-md p-2 text-neutral-500 hover:bg-neutral-200/50 dark:hover:bg-neutral-700/30 dark:hover:text-neutral-100"
                  >
                    <Icon icon="tabler:x" className="h-5 w-5" />
                  </Link>
                </div>
                <div className="h-full min-h-0 flex-1 overflow-y-scroll rounded-md shadow-[8px_8px_10px_0px_rgba(0,0,0,0.05)]">
                  <CodeMirror
                    value={data.code}
                    extensions={[javascript({ jsx: true })]}
                    theme={
                      (theme === 'system' &&
                        window.matchMedia &&
                        window.matchMedia('(prefers-color-scheme: dark)')
                          .matches) ||
                      theme === 'dark'
                        ? atomone
                        : materialLight
                    }
                    readOnly
                    editable={false}
                    basicSetup={{
                      highlightActiveLineGutter: false,
                      highlightActiveLine: false
                    }}
                    className="overflow-hidden rounded-md"
                  />
                </div>
                <button
                  onClick={copyCode}
                  disabled={codeCopied}
                  className="mt-2 flex shrink-0 items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 font-semibold uppercase tracking-wider text-neutral-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] hover:bg-custom-600 dark:text-neutral-800"
                >
                  <Icon
                    icon={codeCopied ? 'tabler:check' : 'tabler:copy'}
                    className="h-5 w-5 shrink-0"
                  />
                  <span className="shrink-0">
                    {codeCopied ? 'Copied' : 'Copy code'}
                  </span>
                </button>
              </div>
            )
        }
      })()}
    </Modal>
  )
}

export default ViewSnippetModal
