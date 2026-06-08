import copy from 'copy-to-clipboard'
import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { Bordered, Button, Flex, Icon, colorWithOpacity } from '@lifeforge/ui'

import MermaidChart from './MermaidChart'

function Code({ language, children }: { language?: string; children: string }) {
  const [copied, setCopied] = useState(false)

  if (language === 'mermaid') {
    return <MermaidChart chart={children} />
  }

  return (
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
      className="code"
      mt="lg"
      r="md"
    >
      <Bordered
        asChild
        borderColor={{
          base: 'bg-200',
          dark: colorWithOpacity('bg-700', '30%')
        }}
        borderSide="bottom"
        borderWidth="1.5px"
        px="md"
        py="sm"
      >
        <Flex align="center" justify="between">
          <Flex
            align="center"
            color="muted"
            gap="sm"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '1rem'
            }}
          >
            <Icon
              icon="tabler:code"
              size="1rem"
              style={{ marginTop: '0.125rem' }}
            />
            <span>{language}</span>
          </Flex>
          <Button
            icon={copied ? 'tabler:check' : 'tabler:copy'}
            iconPosition="start"
            p="sm"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.875rem'
            }}
            variant="plain"
            width="min-content"
            onClick={() => {
              copy(children)
              setCopied(true)
              setTimeout(() => {
                setCopied(false)
              }, 2000)
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </Flex>
      </Bordered>
      <SyntaxHighlighter
        language={language}
        lineProps={{ style: { paddingBottom: 8 } }}
        style={oneDark}
        wrapLines={true}
      >
        {children}
      </SyntaxHighlighter>
    </Bordered>
  )
}

export default Code
