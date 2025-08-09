import dotenv from 'dotenv'
import _ from 'lodash'
import path from 'path'
import Pocketbase from 'pocketbase'

dotenv.config({
  path: path.resolve(__dirname, '../server/env/.env.local')
})

if (!process.env.PB_HOST || !process.env.PB_EMAIL || !process.env.PB_PASSWORD) {
  console.error(
    'Please provide PB_HOST, PB_EMAIL, and PB_PASSWORD in your environment variables.'
  )
  process.exit(1)
}

const pb = new Pocketbase(process.env.PB_HOST)

try {
  await pb
    .collection('_superusers')
    .authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD)

  if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
    console.error('Invalid credentials.')
    process.exit(1)
  }
} catch {
  console.error('Server is not reachable or credentials are invalid.')
  process.exit(1)
}

const allEntries = await pb.collection('scores_library__entries').getFullList()

for (const entry of allEntries) {
  const firstPart = entry.pdf.split('_')[0] as string
  if (firstPart.match(/^\d+$/)) {
    const firstPartNumber = parseInt(firstPart, 10)

    if (firstPartNumber < 1000) continue

    await pb.collection('scores_library__entries').update(entry.id, {
      guitar_world_id: firstPartNumber
    })
  }
}
