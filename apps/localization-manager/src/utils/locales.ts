/* eslint-disable @typescript-eslint/no-explicit-any */
export function isFolder(obj: Record<string, any>): boolean {
  if (typeof obj !== 'object') {
    return false
  }

  return !['en', 'ms', 'zh-CN', 'zh-TW'].every(lng => lng in obj)
}
