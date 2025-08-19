import { useChat } from '@ai-sdk/react'
import forgeAPI from '@utils/forgeAPI'
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls
} from 'ai'
import clsx from 'clsx'
import { Button, ModalHeader, Scrollbar } from 'lifeforge-ui'
import { useState } from 'react'
import Markdown from 'react-markdown'
import { AutoSizer } from 'react-virtualized'
import remarkGfm from 'remark-gfm'
import { getAuthorizationToken, usePersonalization } from 'shared'
import tinycolor from 'tinycolor2'

function ForgeAgentModal({ onClose }: { onClose: () => void }) {
  const { derivedThemeColor } = usePersonalization()

  const { messages, sendMessage, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: forgeAPI.ai.forgeAgent.callTool.endpoint,
      headers: {
        Authorization: `Bearer ${getAuthorizationToken()}`
      }
    }),

    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,

    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getLocation') {
        const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco']

        // No await - avoids potential deadlocks
        addToolResult({
          tool: 'getLocation',
          toolCallId: toolCall.toolCallId,
          output: cities[Math.floor(Math.random() * cities.length)]
        })
      }
    }
  })

  const [input, setInput] = useState('')

  return (
    <div className="min-h-[80vh] min-w-[80vw]">
      <ModalHeader
        hasAI
        icon="tabler:hammer"
        title="Forge Agent"
        onClose={onClose}
      />
      <div className="w-full flex-1 space-y-6">
        <AutoSizer>
          {({ width, height }) => (
            <Scrollbar
              style={{
                width,
                height
              }}
            >
              {messages?.map(message => {
                const role = message.role === 'user' ? 'User' : 'Agent'

                if (role === 'User') {
                  return (
                    <div key={message.id} className="flex w-full justify-end">
                      <div
                        className={clsx(
                          'shadow-custom rounded-lg p-4 px-5',
                          tinycolor(derivedThemeColor).isDark()
                            ? 'text-bg-100'
                            : 'text-bg-800'
                        )}
                        style={{
                          backgroundColor: derivedThemeColor
                        }}
                      >
                        {message.parts.map(part => {
                          switch (part.type) {
                            case 'text':
                              return part.text
                            default:
                              return null
                          }
                        })}
                      </div>
                    </div>
                  )
                }

                return (
                  <>
                    {message.parts.map(part => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <div key={message.id} className="flex w-full">
                              <div className="agent-response component-bg-lighter shadow-custom space-y-3 rounded-lg px-5 py-4">
                                <Markdown remarkPlugins={[remarkGfm]}>
                                  {part.text}
                                </Markdown>
                              </div>
                            </div>
                          )
                      }
                    })}
                    <br />
                  </>
                )
              })}
            </Scrollbar>
          )}
        </AutoSizer>
      </div>
      <div className="component-bg-lighter shadow-custom mt-6 flex w-full items-center gap-8 rounded-xl p-2">
        <input
          className="placeholder:text-bg-500 w-full p-2"
          placeholder="Ask anything..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && input.trim()) {
              setInput('')
              sendMessage({ text: input })
            }
          }}
        />
        <Button
          icon="tabler:send"
          onClick={() => {
            sendMessage({ text: input })
            setInput('')
          }}
        />
      </div>
    </div>
  )
}

export default ForgeAgentModal
