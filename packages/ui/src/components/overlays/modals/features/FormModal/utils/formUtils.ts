import dayjs from 'dayjs'

/**
 * Transforms existing data based on field type to ensure proper format for form inputs.
 *
 * This function handles type-specific transformations when loading existing data into forms.
 * Currently handles datetime fields by converting string dates to Date objects.
 *
 * @param fieldType - The type of the form field (e.g., 'text', 'number', 'datetime')
 * @param value - The raw value to transform
 * @returns The transformed value ready for form input, or the original value if no transformation needed
 *
 * @example
 * ```typescript
 * // Transform datetime string to Date object
 * const dateValue = transformExistedData('datetime', '2023-12-25T10:30:00Z')
 * // Returns: Date object
 *
 * // Non-datetime fields pass through unchanged
 * const textValue = transformExistedData('text', 'Hello World')
 * // Returns: 'Hello World'
 * ```
 */
export const transformExistedData = (
  fieldType: string,
  value: unknown
): unknown => {
  if (fieldType === 'datetime' && value) {
    return dayjs(value as string).toDate()
  }

  return value
}

/**
 * Checks if a form field value should be considered empty.
 *
 * This utility function provides comprehensive empty value detection across different data types
 * commonly used in forms. It handles various edge cases including null objects, empty arrays,
 * invalid dates, and custom object structures used by specific form components.
 *
 * @param value - The value to check for emptiness
 * @returns `true` if the value is considered empty, `false` otherwise
 *
 * @example
 * ```typescript
 * // Basic empty checks
 * checkEmpty(null)           // true
 * checkEmpty(undefined)      // true
 * checkEmpty('')             // true
 * checkEmpty('   ')          // true
 * checkEmpty([])             // true
 * checkEmpty({})             // true
 *
 * // Date checks
 * checkEmpty(new Date('invalid'))  // true
 * checkEmpty(new Date())           // false
 *
 * // File field checks
 * checkEmpty({ file: null, preview: null })    // true
 * checkEmpty({ file: 'removed', preview: '' }) // true
 * checkEmpty({ file: fileObject, preview: 'data:image...' }) // false
 *
 * // Location field checks
 * checkEmpty({ name: '', formattedAddress: '' })           // true
 * checkEmpty({ name: 'Home', formattedAddress: '123 St' }) // false
 *
 * // Valid values
 * checkEmpty('hello')        // false
 * checkEmpty(0)             // false
 * checkEmpty(false)         // false
 * checkEmpty(['item'])      // false
 * ```
 */
export const checkEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true
  }

  if (Array.isArray(value) && value.length === 0) {
    return true
  }

  if (value instanceof Date) {
    return isNaN(value.getTime())
  }

  if (value instanceof File) {
    return false
  }

  if (typeof value === 'object') {
    if (Object.keys(value).length === 0) {
      return true
    }

    if ('file' in value && (!value.file || value.file === 'removed')) {
      return true
    }

    if (
      'name' in value &&
      'formattedAddress' in value &&
      !value.name &&
      !value.formattedAddress
    ) {
      return true
    }
  }

  return false
}

/**
 * Generates initial form data with appropriate default values based on field types.
 *
 * This function creates a complete initial state object for form fields, handling both
 * existing data transformation and default value assignment. It ensures that each field
 * has an appropriate initial value based on its type, preventing undefined states.
 *
 * @template TFormConfig - The form configuration type extending FieldsConfig
 * @param fieldTypes - Object mapping field names to their input types
 * @param fields - The complete field configuration object
 * @param formExistedData - Optional existing data to populate fields with
 * @returns Object with initial values for all form fields
 *
 * @example
 * ```typescript
 * // Define field types and configuration
 * const fieldTypes = {
 *   name: 'text',
 *   age: 'number',
 *   birthDate: 'datetime',
 *   tags: 'listbox',
 *   isActive: 'checkbox',
 *   avatar: 'file'
 * }
 *
 * const fields = {
 *   name: { label: 'Name', required: true },
 *   age: { label: 'Age', min: 0 },
 *   birthDate: { label: 'Birth Date' },
 *   tags: { label: 'Tags', multiple: true },
 *   isActive: { label: 'Active' },
 *   avatar: { label: 'Profile Picture' }
 * }
 *
 * // Generate initial data without existing data
 * const initialData = getInitialData(fieldTypes, fields)
 * // Returns:
 * // {
 * //   name: '',
 * //   age: 0,
 * //   birthDate: null,
 * //   tags: [],              // multiple listbox
 * //   isActive: false,
 * //   avatar: { file: null, preview: null }
 * // }
 *
 * // Generate initial data with existing data
 * const existingData = {
 *   name: 'John Doe',
 *   age: 30,
 *   birthDate: '1993-01-15T00:00:00Z'
 * }
 *
 * const initialDataWithExisting = getInitialData(fieldTypes, fields, existingData)
 * // Returns:
 * // {
 * //   name: 'John Doe',
 * //   age: 30,
 * //   birthDate: Date object (transformed from string),
 * //   tags: [],              // uses default for missing fields
 * //   isActive: false,
 * //   avatar: { file: null, preview: null }
 * // }
 * ```
 */
export const getInitialData = (
  fieldTypes: Record<string, any>,
  fields: Record<string, any>,
  initialData?: Record<string, any>
): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(fieldTypes).map(([key, fieldType]) => {
      // Use existing data if available and not empty
      if (initialData && key in initialData && initialData[key]) {
        return [key, transformExistedData(fieldType, initialData[key])]
      }

      // Set appropriate default value based on field type
      let finalValue: unknown = ''

      switch (fieldType) {
        case 'number':
        case 'currency':
          finalValue = 0
          break
        case 'datetime':
        case 'location':
          finalValue = null
          break
        case 'listbox':
          // Handle single vs multiple selection listboxes
          finalValue = fields[key]?.multiple ? [] : null
          break
        case 'checkbox':
          finalValue = false
          break
        case 'file':
          // File fields need object structure for file and preview
          finalValue = { file: null, preview: null }
          break
        default:
          // Default to empty string for text-based inputs
          finalValue = ''
      }

      return [key, finalValue]
    })
  )
}
