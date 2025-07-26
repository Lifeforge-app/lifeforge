/**
 * Recursively merges the `source` object into the `target` object.
 * - If a key in source is an object (but **not** an array), it merges recursively.
 * - Otherwise, it directly overrides the value in target.
 * - Modifies and returns the original target object (mutative!).
 *
 * @param target The base object to merge into (will be mutated)
 * @param source The source object to merge from
 * @returns The merged target object
 *
 * @example
 * joinObjectsRecursively({a: 1, b: {c: 2}}, {b: {d: 3}, e: 4})
 * // => {a: 1, b: {c: 2, d: 3}, e: 4}
 */
export function joinObjectsRecursively(
  target: Record<string, any>,
  source: Record<string, any>
): Record<string, any> {
  for (const key in source) {
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = joinObjectsRecursively(target[key] || {}, source[key])
    } else {
      target[key] = source[key]
    }
  }

  return target
}

/**
 * Checks if any value in the object is a File instance.
 * Basically, answers the question: "Does this data contain an actual File?"
 *
 * @param data The object to check for File values
 * @returns True if at least one value is a File, otherwise false
 *
 * @example
 * hasFile({ avatar: fileObj, name: "Alice" }) // true
 * hasFile({ name: "Bob" }) // false
 */
export const hasFile = (data: Record<string, any>): boolean =>
  Object.values(data).some(value => value instanceof File)

/**
 * Converts a flat object to FormData, auto-handling:
 * - Files (appended directly, not stringified)
 * - Non-string, non-File values are JSON.stringified
 * - Strings are appended as-is
 *
 * (Files always appended last, so server-side parsing gets less weird ;-;.)
 *
 * @param data The flat object to convert
 * @returns FormData instance ready for upload
 *
 * @example
 * getFormData({ file, meta: { type: 'image' }, name: 'myfile' })
 */
export function getFormData(data: Record<string, any>): FormData {
  const formData = new FormData()

  const fileEntries: Record<string, File> = {}

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof File) {
      fileEntries[key] = value
    } else if (typeof value !== 'string') {
      formData.append(key, JSON.stringify(value))
    } else {
      formData.append(key, value)
    }
  })

  // Always add files last, for server sanity
  Object.entries(fileEntries).forEach(([key, file]) => {
    formData.append(key, file)
  })

  return formData
}
