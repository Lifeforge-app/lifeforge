/* eslint-disable @typescript-eslint/indent */
interface IProjectsKVersion {
  collectionId: string
  collectionName: string
  created: string
  files: string[]
  id: string
  project_id: string
  thumbnail: string
  updated: string
}

interface IProjectsKProgress {
  collectionId: string
  collectionName: string
  completed: number
  created: string
  expand: {
    steps: Record<string, IProjectsKProgressStep>
  }
  id: string
  project: string
  steps: string[]
  updated: string
}

interface IProjectsKProgressStep {
  id: string
  name: string
  icon: string
}

interface IProjectsKEntry {
  collectionId: string
  collectionName: string
  created: string
  customer_name: string
  id: string
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
  updated: string
  files: string[]
  last_file_replacement_time: string
  thumb_original_filename: string
  progress: IProjectsKProgress
}

export type {
  IProjectsKVersion,
  IProjectsKProgress,
  IProjectsKProgressStep,
  IProjectsKEntry
}
