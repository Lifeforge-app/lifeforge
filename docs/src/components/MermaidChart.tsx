import mermaid from 'mermaid'
import { useEffect, useId, useState } from 'react'

import { Bordered, Flex, Icon, Text, colorWithOpacity } from '@lifeforge/ui'

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
      <Bordered
        asChild
        bg={{
          base: colorWithOpacity('red-500', '10%'),
          dark: colorWithOpacity('red-500', '10%')
        }}
        borderColor={{
          base: colorWithOpacity('red-500', '30%'),
          dark: colorWithOpacity('red-500', '30%')
        }}
        mt="lg"
        p="md"
        r="md"
      >
        <Text asChild color="dangerous">
          <Flex align="center" gap="sm">
            <Icon icon="tabler:alert-triangle" />
            <Text>Mermaid Error: {error}</Text>
          </Flex>
        </Text>
      </Bordered>
    )
  }

  return (
    <Flex asChild centered mt="lg" width="100%">
      <Bordered
        shadow
        bg={{
          base: colorWithOpacity('bg-200', '30%'),
          dark: colorWithOpacity('bg-800', '50%')
        }}
        borderColor={{
          base: 'bg-200',
          dark: colorWithOpacity('bg-700', '30%')
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
        p="lg"
        r="md"
      />
    </Flex>
  )
}

export default MermaidChart
