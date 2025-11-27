import fs from 'fs'
import path from 'path'

const TEMP_FILE_DIR = '.temp'

// Ensure temp directory exists
if (!fs.existsSync(TEMP_FILE_DIR)) {
  fs.mkdirSync(TEMP_FILE_DIR)
}

class TempFileManager {
  private readonly filePath: string

  constructor(
    fileName: `${string}.json`,
    private readonly jsonType: 'object' | 'array' = 'array'
  ) {
    if (!fileName.endsWith('.json')) {
      throw new Error('Invalid temp file name, must be a .json file')
    }

    this.filePath = path.join(TEMP_FILE_DIR, fileName)
    this.createFileIfAbsent()
  }

  private createFileIfAbsent(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, this.jsonType === 'array' ? '[]' : '{}')
    }
  }

  public read<T>(): T {
    const fileContent = fs.readFileSync(this.filePath)

    try {
      const parsed = JSON.parse(fileContent.toString())

      return parsed as T
    } catch {
      throw new Error('Invalid JSON in temp file')
    }
  }

  public write(data: Buffer | string): void {
    fs.writeFileSync(this.filePath, data)
  }
}

export default TempFileManager
