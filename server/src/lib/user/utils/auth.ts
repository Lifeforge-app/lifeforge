import COLLECTION_SCHEMAS from '@schema'
import _ from 'lodash'
import Pocketbase from 'pocketbase'
import z from 'zod'

import { SchemaWithPB } from '@functions/database/PBService/typescript/pb_service'

export function removeSensitiveData(userData: Record<string, any>) {
  const newUserData = _.cloneDeep(userData)

  newUserData.hasMasterPassword = Boolean(userData.masterPasswordHash)
  newUserData.hasJournalMasterPassword = Boolean(
    userData.journalMasterPasswordHash
  )
  newUserData.hasAPIKeysMasterPassword = Boolean(
    userData.APIKeysMasterPasswordHash
  )
  newUserData.twoFAEnabled = Boolean(userData.twoFASecret)
  delete newUserData['masterPasswordHash']
  delete newUserData['journalMasterPasswordHash']
  delete newUserData['APIKeysMasterPasswordHash']
  delete newUserData['twoFASecret']

  return newUserData as SchemaWithPB<
    Omit<
      z.infer<(typeof COLLECTION_SCHEMAS)['user__users']>,
      | 'masterPasswordHash'
      | 'journalMasterPasswordHash'
      | 'APIKeysMasterPasswordHash'
      | 'twoFASecret'
    > & {
      hasMasterPassword: boolean
      hasJournalMasterPassword: boolean
      hasAPIKeysMasterPassword: boolean
      twoFAEnabled: boolean
      masterPasswordHash?: string
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
