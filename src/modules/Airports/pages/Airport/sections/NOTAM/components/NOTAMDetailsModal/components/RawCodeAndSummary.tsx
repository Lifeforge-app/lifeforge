import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import { toast } from 'react-toastify'

import { Button } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

function RawCodeAndSummary({
  id,
  raw,
  isOpen
}: {
  id: string
  raw: string
  isOpen: boolean
}) {
  const [summary, setSummary] = useState<string | null>(null)
  const [summarizeButtonLoading, setSummarizeButtonLoading] = useState(false)

  async function summarizeWithAI() {
    setSummarizeButtonLoading(true)

    try {
      const data = await fetchAPI<string>(`airports/NOTAM/${id}/summarize`, {
        method: 'GET'
      })

      setSummary(data)
      toast.success('NOTAM summarized successfully')
    } catch {
      toast.error('Failed to summarize NOTAM')
    } finally {
      setSummarizeButtonLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setSummary(null)
    }
  }, [isOpen])

  return (
    <div className="bg-bg-200/50 text-bg-500 shadow-custom dark:bg-bg-800 mt-6 w-full min-w-0 rounded-md p-4">
      <code className="w-full min-w-0 whitespace-pre-wrap">{raw}</code>
      {summary === null ? (
        <Button
          className="mt-4 w-full"
          icon="mage:stars-c"
          loading={summarizeButtonLoading}
          onClick={() => {
            summarizeWithAI().catch(console.error)
          }}
        >
          Summarize with AI
        </Button>
      ) : (
        <div className="bg-bg-300/50 text-bg-800 dark:bg-bg-700/50 dark:text-bg-50 mt-4 rounded-md p-4">
          <Markdown className="prose">{summary}</Markdown>
          <div className="mt-4 rounded-md border-l-4 border-yellow-500 bg-yellow-500/20 p-4 text-yellow-500">
            <h2 className="flex items-center gap-2 text-xl font-medium">
              <Icon className="size-5" icon="tabler:alert-triangle" />
              Warning
            </h2>
            <p className="mt-2">
              The summarized content may not be accurate. Please verify the
              information before using it.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default RawCodeAndSummary
