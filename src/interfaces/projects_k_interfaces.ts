import type BasePBCollection from '@interfaces/pocketbase_interfaces'

interface IProjectsKVersion extends BasePBCollection {
  files: string[]
  project_id: string
  thumbnail: string
}

interface IProjectsKProgress extends BasePBCollection {
  completed: number
  expand: {
    steps: Record<string, IProjectsKProgressStep>
  }
  project: string
  steps: string[]
}

interface IProjectsKProgressStep {
  id: string
  name: string
  icon: string
}

interface IProjectsKEntry extends BasePBCollection {
  customer_name: string
  is_released: boolean
  name: string
  payment_status?: {
    total_amt: number
    deposit_amt: number
    fully_paid: boolean
    deposit_paid: boolean
    fully_paid_date: string
    deposit_paid_date: string
  }
  status: 'scheduled' | 'wip' | 'completed'
  thumbnail: string
  type: 'personal' | 'commercial'
  files: string[]
  last_file_replacement_time: string
  thumb_original_filename: string
  progress: IProjectsKProgress
}

export type {
  IProjectsKEntry,
  IProjectsKProgress,
  IProjectsKProgressStep,
  IProjectsKVersion
}
