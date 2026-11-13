import { v5 as uuidv5 } from 'uuid'

import { NAMESPACE_ID } from './constants'

/**
 * Deterministically maps a PocketBase record id to the UUID it will have in
 * the new database. Because the mapping is a pure function, relations can be
 * translated without any lookup table and across independent migration runs.
 */
export function newId(pbId: string): string {
  return uuidv5(pbId, NAMESPACE_ID)
}
