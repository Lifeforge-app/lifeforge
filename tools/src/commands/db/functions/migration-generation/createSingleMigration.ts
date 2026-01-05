import { execSync } from 'child_process'
import fs from 'fs'
import prettier from 'prettier'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'

import { PRETTIER_OPTIONS } from '../../utils'

/**
 * Creates a single PocketBase migration file with custom up migration content.
 *
 * This function:
 * 1. Uses PocketBase CLI to generate a new migration file scaffold
 * 2. Parses the output to find the created file path
 * 3. Replaces the placeholder comments with the provided migration content
 * 4. Formats the file with Prettier for consistent code style
 *
 * Down migrations are intentionally left as comments since automatic rollback
 * could cause data loss - users should manually handle rollbacks.
 *
 * @param name - Name for the migration file (e.g., 'skeleton_users', 'structure_posts')
 * @param upContent - JavaScript code to execute during `migrate up`. If empty, skips creation.
 *
 * @throws Error if PocketBase CLI fails to create the migration file
 * @throws Error if the created file path cannot be parsed from the CLI output
 * @throws Error if the created file doesn't exist at the expected path
 */
export default async function createSingleMigration(
  name: string,
  upContent: string
): Promise<void> {
  if (!upContent) {
    return
  }

  const response = execSync(
    `${PB_BINARY_PATH} migrate create ${name} ${PB_KWARGS.join(' ')}`,
    {
      input: 'y\n',
      stdio: ['pipe', 'pipe', 'pipe']
    }
  )

  const resString = response.toString()

  const match = resString.match(/Successfully created file "(.*)"/)

  if (!match || match.length < 2) {
    throw new Error('Failed to parse migration file path from response.')
  }

  const migrationFilePath = match[1]

  if (!fs.existsSync(migrationFilePath)) {
    throw new Error(`Migration file not found at path: ${migrationFilePath}`)
  }

  let content = fs.readFileSync(migrationFilePath, 'utf-8')

  content = content
    .replace('../pb_data/types.d.ts', '../types.d.ts')
    .replace('// add up queries...', upContent)
    .replace(
      '// add down queries...',
      '// Users need to manually undo changes to prevent data loss'
    )

  const formattedContent = await prettier.format(content, PRETTIER_OPTIONS)

  fs.writeFileSync(migrationFilePath, formattedContent, 'utf-8')
}
