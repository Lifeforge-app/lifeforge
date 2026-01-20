import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import fs from 'fs'
import path from 'path'

import logger from '@/utils/logger'

dayjs.extend(weekOfYear)

const boilerPlate = `import Commit from "../../components/Commit";
import Code from "@/components/Code";

### 🏗️ Infrastructure & Technical Improvements

### 🎨 UI Components & Design System
    
### 🐛 Bug Fixes & Chores

### 📖 Documentation & Tooling
`

const CHANGELOG_PATH = path.resolve(
  import.meta.dirname.split('tools')[0],
  'docs/src/contents/04.progress/versions'
)

export default function createChangelogHandler(year?: string, week?: string) {
  const targetYear = Number(year) || dayjs().year()

  const currentWeek = Number(week) || dayjs().week()

  if (!fs.existsSync(CHANGELOG_PATH)) {
    logger.error(`Changelog directory not found at path: ${CHANGELOG_PATH}`)
    process.exit(1)
  }

  const yearPath = `${CHANGELOG_PATH}/${targetYear}`

  if (!fs.existsSync(yearPath) || !fs.lstatSync(yearPath).isDirectory()) {
    fs.mkdirSync(yearPath)
  }

  const filePath = `${yearPath}/${String(currentWeek).padStart(2, '0')}.mdx`

  if (fs.existsSync(filePath)) {
    logger.error(
      `Changelog file for year ${targetYear} week ${currentWeek} already exists at path: ${filePath}`
    )
    process.exit(1)
  }

  fs.writeFileSync(filePath, boilerPlate)

  logger.success(`Created changelog file at path: ${filePath}`)
}
