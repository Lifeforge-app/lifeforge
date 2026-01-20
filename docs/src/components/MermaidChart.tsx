import { Icon } from '@iconify/react'
import mermaid from 'mermaid'
import { useEffect, useId, useState } from 'react'

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#3b82f6',
    primaryTextColor: '#fff',
    primaryBorderColor: '#1e40af',
    lineColor: '#64748b',
    secondaryColor: '#1e293b',
    tertiaryColor: '#0f172a'
  }
})

function MermaidChart({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, '')

  const [svg, setSvg] = useState<string>('')

  const [error, setError] = useState<string>('')

  useEffect(() => {
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, chart)

        setSvg(svg)
        setError('')
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to render diagram'
        )
      }
    }

    renderChart()
  }, [chart, id])

  if (error) {
    return (
      <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 p-4 text-red-400">
        <div className="flex items-center gap-2">
          <Icon icon="tabler:alert-triangle" />
          <span>Mermaid Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="bg-bg-200/30 dark:bg-bg-800/50 border-bg-200 dark:border-bg-700/30 mt-6 flex justify-center rounded-md border p-6 shadow-sm"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default MermaidChart
