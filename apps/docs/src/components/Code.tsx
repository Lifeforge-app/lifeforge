import { Icon } from '@iconify/react/dist/iconify.js'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

function Code({ language, children }: { language?: string; children: string }) {
  return (
    <div className="bg-bg-200/50 dark:bg-bg-800/30 border-bg-200 dark:border-bg-800 mt-6 rounded-md border">
      <div className="border-bg-200 dark:border-bg-800 flex items-center justify-between border-b-[1.5px] px-4 py-2">
        <div className="text-bg-500 flex items-center gap-2 font-mono text-base">
          <Icon className="mt-0.5 size-4" icon="tabler:code" />
          <span>{language}</span>
        </div>
        <div className="text-bg-500 flex items-center gap-2 font-mono text-base">
          <Icon className="mt-0.5 size-4" icon="tabler:copy" />
          <span>Copy</span>
        </div>
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
