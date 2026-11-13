import { execSync } from 'node:child_process'

/** Runs a shell command synchronously and returns trimmed stdout. */
export function run(command: string, cwd?: string): string {
  return execSync(command, { cwd, encoding: 'utf-8' }).trim()
}

/** Calls the GitHub API via the `gh` CLI and parses the JSON response. */
export function ghApi<T = unknown>(endpoint: string): T {
  return JSON.parse(run(`gh api ${endpoint}`)) as T
}
