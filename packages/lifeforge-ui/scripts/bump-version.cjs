#!/usr/bin/env node

/* eslint-disable sonarjs/no-os-command-from-path */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const packageJsonPath = path.resolve(__dirname, '../package.json')

function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function bumpVersionAndPublish() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const currentVersion = packageJson.version

    const versionRegex = /^0\.(\d+)\.(\d+)-(\d+)$/
    const match = currentVersion.match(versionRegex)

    if (!match) {
      console.error(
        `Current version ${currentVersion} doesn't match the expected format 0.<year>.<weekNumber>-<iterationNumber>`
      )
      process.exit(1)
    }

    const [, currentYear, currentWeek, currentIteration] = match.map(Number)

    const now = new Date()
    const year = now.getFullYear() % 100
    const week = getWeekNumber(now)

    let newIteration
    if (year === currentYear && week === currentWeek) {
      newIteration = currentIteration + 1
    } else {
      newIteration = 1
    }

    const newVersion = `0.${year}.${week}-${newIteration}`

    packageJson.version = newVersion
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + '\n'
    )

    console.log(`Version bumped from ${currentVersion} to ${newVersion}`)

    console.log('Building package...')
    execSync('bun run build', { stdio: 'inherit' })

    console.log('Publishing package...')
    execSync('bun publish', { stdio: 'inherit' })

    console.log(`Successfully published version ${newVersion}!`)
  } catch (error) {
    console.error('Error bumping version and publishing:', error)
    process.exit(1)
  }
}

bumpVersionAndPublish()
