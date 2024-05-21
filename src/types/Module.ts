interface ModuleConfigInput {
  type: 'input'
  icon: string
  name: string
  placeholder: string
  isPassword?: boolean
}

interface ModuleConfigSelect {
  type: 'select'
  icon: string
  name: string
  description?: string
  options: Array<{
    value: string
    label: string
  }>
}

interface ModuleConfigSwitch {
  type: 'switch'
  icon: string
  name: string
  defaultValue: boolean
  description?: string
}

interface ModuleEntry {
  name: string
  description?: string
  icon: string
  config?: Record<
    string,
    ModuleConfigInput | ModuleConfigSelect | ModuleConfigSwitch
  >
}

export type {
  ModuleEntry,
  ModuleConfigInput,
  ModuleConfigSelect,
  ModuleConfigSwitch
}
