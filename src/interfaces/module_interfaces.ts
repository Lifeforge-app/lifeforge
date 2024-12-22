interface IModuleConfigInput {
  type: 'input'
  icon: string
  name: string
  placeholder: string
  isPassword?: boolean
}

interface IModuleConfigSelect {
  type: 'select'
  icon: string
  name: string
  description?: string
  options: Array<{
    value: string
    label: string
  }>
}

interface IModuleConfigSwitch {
  type: 'switch'
  icon: string
  name: string
  defaultValue: boolean
  description?: string
}

interface IModuleEntry {
  name: string
  description?: string
  icon: string
  config?: Record<
    string,
    IModuleConfigInput | IModuleConfigSelect | IModuleConfigSwitch
  >
  deprecated?: boolean
}

export type {
  IModuleConfigInput,
  IModuleConfigSelect,
  IModuleConfigSwitch,
  IModuleEntry
}
