import type { ForgeAPIClientController } from 'shared'

export interface ModuleConfig {
  name: string
  icon: React.ReactElement | string
  provider?:
    | React.LazyExoticComponent<React.ComponentType<any>>
    | (() => React.ReactElement)
  routes: Record<
    string,
    | React.LazyExoticComponent<React.ComponentType<any>>
    | (() => React.ReactElement)
  >
  togglable: boolean
  hasAI?: boolean
  otpControllers?: {
    getChallenge: ForgeAPIClientController
    verifyOTP: ForgeAPIClientController
  }
  requiredAPIKeys?: string[]
  subsection?: {
    label: string
    icon: React.ReactElement | string
    path: string
  }[]
  hidden?: boolean
  forceDisable?: boolean
}

export interface ModuleCategory {
  title: string
  items: ModuleConfig[]
}
