import chalk from 'chalk'
import dotenv from 'dotenv'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import Pocketbase, { type CollectionModel } from 'pocketbase'
import prettier from 'prettier'

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

const allEntries = await pb.collection('idea_box__entries').getFullList()

for (const entry of allEntries) {
  if (entry.type === 'text') {
    await pb.collection('idea_box__entries_text').create({
      base_entry: entry.id,
      content: entry.content,
      title: entry.title
    })
  } else if (entry.type === 'image') {
    const image = entry.image
    const imageLink = pb.files.getURL(entry, entry.image)
    const imageBuffer = await fetch(imageLink).then(res => res.arrayBuffer())

    await pb.collection('idea_box__entries_image').create({
      base_entry: entry.id,
      image: new File([imageBuffer], image)
    })
  } else {
    await pb.collection('idea_box__entries_link').create({
      base_entry: entry.id,
      link: entry.content
    })
  }
}
