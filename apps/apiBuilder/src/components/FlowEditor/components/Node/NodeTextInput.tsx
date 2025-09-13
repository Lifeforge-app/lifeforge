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
        className="w-full bg-transparent"
        disabled={disabled}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={e => setValue?.(e.target.value)}
      />
    </NodeColumnValueWrapper>
  )
}

export default NodeTextInput
