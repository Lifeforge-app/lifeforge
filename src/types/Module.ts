/* eslint-disable @typescript-eslint/indent */
interface ModuleEntry {
  name: string
  icon: string
  config?: Record<
    string,
    {
      icon: string
      name: string
      placeholder: string
      isPassword?: boolean
    }
  >
}

export type { ModuleEntry }
