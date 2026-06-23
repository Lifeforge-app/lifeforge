import _ from 'lodash'
import Pocketbase from 'pocketbase'
import z from 'zod'

import { SchemaWithPB } from '@lifeforge/server-utils'

import schema from '../schema'

export function removeSensitiveData(userData: Record<string, any>) {
  const newUserData = _.cloneDeep(userData)

  newUserData.hasJournalMasterPassword = Boolean(
    userData.journalMasterPasswordHash
  )
  newUserData.hasAPIKeysMasterPassword = Boolean(
    userData.APIKeysMasterPasswordHash
  )
  newUserData.twoFAEnabled = Boolean(userData.twoFASecret)
  delete newUserData['journalMasterPasswordHash']
  delete newUserData['APIKeysMasterPasswordHash']
  delete newUserData['twoFASecret']

  return newUserData as SchemaWithPB<
    Omit<
      z.infer<(typeof schema)['users']>,
      'journalMasterPasswordHash' | 'APIKeysMasterPasswordHash' | 'twoFASecret'
    > & {
      hasJournalMasterPassword: boolean
      hasAPIKeysMasterPassword: boolean
      twoFAEnabled: boolean
      journalMasterPasswordHash?: string
      APIKeysMasterPasswordHash?: string
      twoFASecret?: string
    }
  >
}

export async function updateNullData(
  userData: Record<string, any>,
  pb: Pocketbase
) {
  if (!userData.enabledModules) {
    await pb.collection('users').update(userData.id, {
      enabledModules: []
    })
    userData.enabledModules = []
  }

  if (!userData.dashboardLayout) {
    await pb.collection('users').update(userData.id, {
      dashboardLayout: {}
    })
    userData.dashboardLayout = {}
  }
}
