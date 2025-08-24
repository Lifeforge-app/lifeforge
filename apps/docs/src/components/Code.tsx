import { Icon } from '@iconify/react/dist/iconify.js'
import copy from 'copy-to-clipboard'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function Code({ language, children }: { language?: string; children: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="bg-bg-200/30 dark:bg-bg-800/50 border-bg-200 dark:border-bg-700/30 mt-6 rounded-md border shadow-sm">
      <div className="border-bg-200 dark:border-bg-700/30 flex items-center justify-between border-b-[1.5px] px-4 py-2">
        <div className="text-bg-500 flex items-center gap-2 font-mono text-base">
          <Icon className="mt-0.5 size-4" icon="tabler:code" />
          <span>{language}</span>
        </div>
        <button
          className="text-bg-500 flex items-center gap-2 font-mono text-base"
          onClick={() => {
            copy(children)

            setCopied(true)

            setTimeout(() => {
              setCopied(false)
            }, 2000)
          }}
        >
          <Icon
            className="mt-0.5 size-4"
            icon={copied ? 'tabler:check' : 'tabler:copy'}
          />
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        lineProps={{ style: { paddingBottom: 8 } }}
        style={oneDark}
        wrapLines={true}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

export default Code
