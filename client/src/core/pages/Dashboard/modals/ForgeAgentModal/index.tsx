import { useChat } from '@ai-sdk/react'
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls
} from 'ai'
import { ModalHeader } from 'lifeforge-ui'
import { useState } from 'react'

function ForgeAgentModal({ onClose }: { onClose: () => void }) {
  const { messages, sendMessage, addToolResult } = useChat({
    transport: new DefaultChatTransport({
      api: ,
      headers
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
      {messages?.map(message => (
        <div key={message.id}>
          <strong>{`${message.role}: `}</strong>
          {message.parts.map(part => {
            switch (part.type) {
              // render text parts as simple text:
              case 'text':
                return part.text

              // for tool parts, use the typed tool part names:
              case 'tool-askForConfirmation': {
                const callId = part.toolCallId

                switch (part.state) {
                  case 'input-streaming':
                    return (
                      <div key={callId}>Loading confirmation request...</div>
                    )
                  case 'input-available':
                    return (
                      <div key={callId}>
                        {part.input.message}
                        <div>
                          <button
                            onClick={() =>
                              addToolResult({
                                tool: 'askForConfirmation',
                                toolCallId: callId,
                                output: 'Yes, confirmed.'
                              })
                            }
                          >
                            Yes
                          </button>
                          <button
                            onClick={() =>
                              addToolResult({
                                tool: 'askForConfirmation',
                                toolCallId: callId,
                                output: 'No, denied'
                              })
                            }
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )
                  case 'output-available':
                    return (
                      <div key={callId}>
                        Location access allowed: {part.output}
                      </div>
                    )
                  case 'output-error':
                    return <div key={callId}>Error: {part.errorText}</div>
                }
                break
              }

              case 'tool-getLocation': {
                const callId = part.toolCallId

                switch (part.state) {
                  case 'input-streaming':
                    return <div key={callId}>Preparing location request...</div>
                  case 'input-available':
                    return <div key={callId}>Getting location...</div>
                  case 'output-available':
                    return <div key={callId}>Location: {part.output}</div>
                  case 'output-error':
                    return (
                      <div key={callId}>
                        Error getting location: {part.errorText}
                      </div>
                    )
                }
                break
              }

              case 'tool-getWeatherInformation': {
                const callId = part.toolCallId

                switch (part.state) {
                  // example of pre-rendering streaming tool inputs:
                  case 'input-streaming':
                    return (
                      <pre key={callId}>{JSON.stringify(part, null, 2)}</pre>
                    )
                  case 'input-available':
                    return (
                      <div key={callId}>
                        Getting weather information for {part.input.city}...
                      </div>
                    )
                  case 'output-available':
                    return (
                      <div key={callId}>
                        Weather in {part.input.city}: {part.output}
                      </div>
                    )
                  case 'output-error':
                    return (
                      <div key={callId}>
                        Error getting weather for {part.input.city}:{' '}
                        {part.errorText}
                      </div>
                    )
                }
                break
              }
            }
          })}
          <br />
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault()

          if (input.trim()) {
            sendMessage({ text: input })
            setInput('')
          }
        }}
      >
        <input value={input} onChange={e => setInput(e.target.value)} />
      </form>
    </div>
  )
}

export default ForgeAgentModal
