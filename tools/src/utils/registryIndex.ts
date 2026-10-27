import { fetchJson, rawRegistryUrl } from './github'

export type RegistryKind = 'modules' | 'locales'

export interface RegistryEntry {
  /** The scope-stripped module/locale id (e.g. `lifeforge--wallet`). */
  id: string
  /** The module/locale's GitHub repo (`owner/repo`). */
  repo: string
  /** Latest published semver version. */
  latest: string
  /** Map of semver version -> release commit SHA. */
  versions: Record<string, string>
}

/** Fetches the full module/locale index from the registry repo. */
export async function fetchRegistry(
  kind: RegistryKind
): Promise<RegistryEntry[]> {
  return fetchJson<RegistryEntry[]>(rawRegistryUrl(`${kind}.json`))
}

/** Resolves a registry entry by module/locale id (with or without scope). */
export async function resolveEntry(
  kind: RegistryKind,
  id: string
): Promise<RegistryEntry | undefined> {
  const shortId = id.replace(/^@lifeforge\//, '')

  const list = await fetchRegistry(kind)

  return list.find(entry => entry.id === shortId || entry.id === id)
}
