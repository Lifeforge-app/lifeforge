import { DashboardItem } from 'lifeforge-ui'
import Markdown from 'react-markdown'

interface SummaryDisplayProps {
  summary: string | null
}

function SummaryDisplay({ summary }: SummaryDisplayProps) {
  if (!summary) return null

  return (
    <DashboardItem
      className="mt-6 h-min"
      icon="tabler:file-text"
      namespace="apps.youtubeSummarizer"
      title="Video Summary"
    >
      <div className="text-bg-500 prose max-w-full!">
        <Markdown>{summary}</Markdown>
      </div>
    </DashboardItem>
  )
}

export default SummaryDisplay
