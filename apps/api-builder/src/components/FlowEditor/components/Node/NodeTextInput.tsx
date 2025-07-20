import NodeColumnValueWrapper from './NodeColumnValueWrapper'

function NodeTextInput({
  value,
  setValue,
  placeholder = 'Enter text',
  disabled = false
}: {
  value: string
  setValue?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <NodeColumnValueWrapper>
      <input
        type="text"
        value={value}
        onChange={e => setValue?.(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent"
        disabled={disabled}
      />
    </NodeColumnValueWrapper>
  )
}

export default NodeTextInput
