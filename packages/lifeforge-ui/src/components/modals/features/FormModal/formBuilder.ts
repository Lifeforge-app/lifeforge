/* eslint-disable @typescript-eslint/no-explicit-any */
import FormModal from '.'
import type {
  FieldsConfig,
  FormState,
  InferFormFinalState,
  InferFormState,
  MatchFieldByFormDataType
} from './typescript/form_interfaces'

/**
 * Since the inferred body input data from `forgeAPI` might be complex unions,
 * we need a way to flatten these unions for easier type inference.
 *
 * @template T - The union type to flatten
 */
type FlattenUnion<T> = {
  [K in T extends any ? keyof T : never]: T extends { [k in K]?: any }
    ? T[K]
    : never
}

/**
 * A type-safe form builder class that provides a fluent API for constructing FormModal configurations.
 *
 * This class uses the builder pattern to allow step-by-step configuration of form properties
 * with full TypeScript type safety and inference. Each method returns a new instance with
 * updated type parameters, ensuring that the form configuration is valid at compile time.
 *
 * @template TFormState - The base form state type defining field names and data types
 * @template TFieldType - Mapping of field names to their corresponding field types
 * @template TFieldsConfig - Configuration object for form fields (initially undefined)
 * @template TFinalFields - Final processed field configuration with type information
 * @template TInitialData - Initial form data type (initially undefined)
 * @template TOnSubmit - Submit handler function type (initially undefined)
 * @template TOnChange - Change handler function type (initially undefined)
 *
 * @example
 * ```tsx
 * // Define form structure
 * type UserForm = {
 *   name: string
 *   email: string
 *   age: number
 * }
 *
 * // Build form configuration
 * const formConfig = defineForm<UserForm>()
 *   .ui({
 *     title: 'Create User',
 *     icon: 'user-plus',
 *     onClose: () => setModalOpen(false),
 *     submitButton: 'tabler:plus'
 *   })
 *   .typesMap({ name: 'text', email: 'email', age: 'number' })
 *   .setupFields({
 *     name: { label: 'Full Name', required: true },
 *     email: { label: 'Email Address', required: true },
 *     age: { label: 'Age', min: 0, max: 120 }
 *   })
 *   .initialData({ name: '', email: '', age: 0 })
 *   .onSubmit(async (data) => {
 *     console.log('Submitting:', data)
 *   })
 *   .build()
 * ```
 */
class FormBuilder<
  TFormState extends FormState,
  TFieldType extends {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  } = {
    [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
  },
  TFieldsConfig = undefined,
  TFinalFields = undefined,
  TInitialData = undefined,
  TOnSubmit = undefined,
  TOnChange = undefined
> {
  /** UI configuration for the form modal */
  private readonly uiConfig?: React.ComponentProps<typeof FormModal>['ui']
  /** Mapping of field names to their types */
  private readonly fieldType?: TFieldType
  /** Raw field configuration object */
  private readonly fields?: TFieldsConfig
  /** Final processed field configuration with types */
  private readonly finalFields?: TFinalFields
  /** Initial data for form fields */
  private readonly _initialData?: TInitialData
  /** Form change event handler */
  private readonly _onChange?: TOnChange
  /** Form submission handler */
  private readonly _onSubmit?: TOnSubmit

  /**
   * Creates a new FormBuilder instance. Generally not called directly - use `defineForm()` instead.
   *
   * @param opts - Optional configuration object containing all builder properties
   */
  constructor(opts?: {
    uiConfig?: React.ComponentProps<typeof FormModal>['ui']
    fieldType?: TFieldType
    fields?: TFieldsConfig
    finalFields?: TFinalFields
    initialData?: TInitialData
    onSubmit?: TOnSubmit
    onChange?: TOnChange
  }) {
    if (opts) {
      this.uiConfig = opts.uiConfig
      this.fieldType = opts.fieldType
      this.fields = opts.fields
      this.finalFields = opts.finalFields
      this._initialData = opts.initialData
      this._onChange = opts.onChange
      this._onSubmit = opts.onSubmit
    }
  }

  /**
   * Configures the UI appearance and behavior of the form modal.
   *
   * @param uiConfig - Configuration object for the modal UI with the following properties:
   *   - `title`: Modal title text (required)
   *   - `icon`: Icon identifier for the modal header (required)
   *   - `onClose`: Function called when modal is closed (required)
   *   - `namespace`: Optional translation namespace for internationalization
   *   - `loading`: Optional loading state flag
   *   - `submitButton`: Either 'create'/'update' preset or custom Button component props
   * @returns A new FormBuilder instance with the UI configuration applied
   *
   * @example
   * ```tsx
   * .ui({
   *   title: 'Create New User',
   *   icon: 'user-plus',
   *   onClose: () => setModalOpen(false),
   *   namespace: 'users',
   *   loading: false,
   *   submitButton: 'create'
   * })
   *
   * // Or with custom submit button
   * .ui({
   *   title: 'Update Profile',
   *   icon: 'edit',
   *   onClose: handleClose,
   *   submitButton: {
   *     variant: 'primary',
   *     children: 'Save Changes',
   *     icon: "tabler:check"
   *   }
   * })
   * ```
   */
  ui(
    uiConfig: React.ComponentProps<typeof FormModal>['ui']
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFieldsConfig,
    TFinalFields,
    TInitialData,
    TOnSubmit,
    TOnChange
  > {
    return new FormBuilder({
      ...this,
      uiConfig
    })
  }

  /**
   * Maps form field names to their corresponding input types.
   * This step is required and defines what type of input component will be rendered for each field.
   *
   * @param fieldType - Object mapping field names to their input types.
   *                    IntelliSense for the `setupFields()` function will provide suggestions
   *                    based on this mapping. Available field types for each form field are inferred
   *                    from the form state type.
   * @returns A new FormBuilder instance with the field type mapping applied
   *
   * @example
   * ```tsx
   * .typesMap({
   *   name: 'text',
   *   email: 'email',
   *   age: 'number',
   *   country: 'select'
   * })
   * ```
   */
  typesMap<
    TFieldType2 extends {
      [K in keyof TFormState]: MatchFieldByFormDataType<TFormState[K]>['type']
    }
  >(
    fieldType: TFieldType2
  ): FormBuilder<
    TFormState,
    TFieldType2,
    TFieldsConfig,
    TFinalFields,
    TInitialData,
    TOnSubmit,
    TOnChange
  > {
    return new FormBuilder({
      ...this,
      fieldType
    })
  }

  /**
   * Configures the individual form fields with their properties and validation rules.
   * This method processes the field configuration and merges it with the previously defined field types.
   * Available config options for each field is inferred from the corresponding field type mapping defined
   * in the `typesMap()` step.
   *
   * @param fields - Configuration object where keys are field names and values contain field properties
   * @returns A new FormBuilder instance with processed field configuration
   *
   * @example
   * ```tsx
   * .setupFields({
   *   name: {
   *     label: 'Full Name',
   *     placeholder: 'Enter your full name',
   *     required: true
   *   },
   *   email: {
   *     label: 'Email Address',
   *     placeholder: 'you@example.com',
   *     required: true
   *   },
   *   age: {
   *     label: 'Age',
   *     required: true
   *   }
   * })
   * ```
   */
  setupFields<TFields extends FieldsConfig<TFormState, TFieldType>>(
    fields: TFields
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFields,
    {
      [K in keyof TFields]: TFields[K] & {
        type: TFieldType[K extends keyof TFieldType ? K : never]
      }
    },
    TInitialData,
    TOnSubmit,
    TOnChange
  > {
    // Merge field types into field configurations
    for (const key in fields) {
      ;(fields[key] as any).type = (this.fieldType as any)[key]
    }
    type TFinalFields2 = {
      [K in keyof TFields]: TFields[K] & {
        type: TFieldType[K extends keyof TFieldType ? K : never]
      }
    }

    return new FormBuilder({
      ...this,
      fields,
      finalFields: fields as unknown as TFinalFields2
    })
  }

  /**
   * Sets the initial data for the form fields. This is optional and allows pre-populating fields.
   *
   * @param initialData - Partial object containing initial values for form fields
   * @returns A new FormBuilder instance with initial data configured
   *
   * @example
   * ```tsx
   * .initialData({
   *   name: 'John Doe',
   *   email: 'john@example.com'
   *   // age field will remain empty
   * })
   * ```
   */
  initialData(
    initialData?: Partial<
      InferFormState<NonNullable<TFieldType>, NonNullable<TFinalFields>>
    >
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFieldsConfig,
    TFinalFields,
    typeof initialData,
    TOnSubmit,
    TOnChange
  > {
    return new FormBuilder({
      uiConfig: this.uiConfig,
      fieldType: this.fieldType,
      fields: this.fields,
      finalFields: this.finalFields,
      initialData
    })
  }

  /**
   * Sets the form submission handler. This is a required step.
   * The callback receives the final form data with proper typing.
   *
   * @param callback - Async function that handles form submission
   * @returns A new FormBuilder instance with the submit handler configured
   *
   * @example
   * ```tsx
   * .onSubmit(async (data) => {
   *     // Do some preprocessing if needed before submission
   *
   *     await mutation.mutateAsync(data)
   * })
   * ```
   */
  onSubmit(
    callback: (
      data: InferFormFinalState<
        NonNullable<TFieldType>,
        NonNullable<TFinalFields>
      >
    ) => Promise<void>
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFieldsConfig,
    TFinalFields,
    TInitialData,
    typeof callback,
    TOnChange
  > {
    return new FormBuilder({
      uiConfig: this.uiConfig,
      fieldType: this.fieldType,
      fields: this.fields,
      finalFields: this.finalFields,
      initialData: this._initialData,
      onSubmit: callback,
      onChange: this._onChange
    })
  }

  /**
   * Sets a change handler that fires whenever form data changes. This is optional.
   * Useful for dependent field updates, or other reactive behavior.
   *
   * @param callback - Function that handles form data changes
   * @returns A new FormBuilder instance with the change handler configured
   *
   * @example
   * ```tsx
   * const [country, setCountry] = useState<string | undefined>(undefined)
   *
   * defineForm<{
   *   country: string
   *   state: string
   * }>()
   * .ui({
   *   ...
   * })
   * .typesMap({
   *   country: 'listbox',
   *   state: 'text'
   * })
   * .setupFields({
   *   country: {
   *     label: 'Country',
   *     options: [
   *       { value: 'US', label: 'United States' },
   *       { value: 'CA', label: 'Canada' }
   *     ]
   *   },
   *   state: {
   *     label: 'State',
   *     placeholder: 'Enter your state',
   *     // Show this field only if a country is selected
   *     hidden: !country
   *   }
   * })
   * .onChange((data) => {
   *    setCountry(data.country)
   * })
   * ```
   */
  onChange(
    callback: (
      data: InferFormState<NonNullable<TFieldType>, NonNullable<TFinalFields>>
    ) => void
  ): FormBuilder<
    TFormState,
    TFieldType,
    TFieldsConfig,
    TFinalFields,
    TInitialData,
    TOnSubmit,
    typeof callback
  > {
    return new FormBuilder({
      uiConfig: this.uiConfig,
      fieldType: this.fieldType,
      fields: this.fields,
      finalFields: this.finalFields,
      initialData: this._initialData,
      onSubmit: this._onSubmit,
      onChange: callback
    })
  }

  /**
   * Builds the final FormModal configuration object.
   * This method validates that all required steps have been completed and returns
   * a configuration object that can be passed to the FormModal component.
   *
   * @returns Configuration object for FormModal component
   * @throws Error if required configuration steps are missing
   *
   * @example
   * ```tsx
   * const formConfig = defineForm<UserForm>()
   *   .ui({ title: 'Create User' })
   *   .typesMap({ name: 'text', email: 'email' })
   *   .setupFields({ name: { label: 'Name' }, email: { label: 'Email' } })
   *   .onSubmit(async (data) => { await saveUser(data) })
   *   .build()
   *
   * // Use with FormModal
   * <FormModal {...formConfig} isOpen={isOpen} onClose={onClose} />
   * ```
   */
  build(): React.ComponentProps<typeof FormModal> {
    const {
      uiConfig,
      fieldType,
      finalFields,
      _initialData,
      _onSubmit,
      _onChange
    } = this

    // Validate that all required configuration steps are complete
    if (!uiConfig || !fieldType || !finalFields || !_onSubmit) {
      throw new Error('FormBuilder: Some required steps not complete')
    }

    return {
      form: {
        fieldTypes: fieldType,
        fields: finalFields,
        initialData: _initialData as any,
        onSubmit: _onSubmit as unknown as (
          data: InferFormFinalState<any, any>
        ) => Promise<void>,
        onChange: _onChange as unknown as (
          data: InferFormFinalState<any, any>
        ) => void
      },
      ui: uiConfig
    }
  }
}

/**
 * Factory function to create a new type-safe form builder instance.
 *
 * This is the entry point for building forms with full TypeScript type safety.
 * The generic parameter defines the shape of your form data, and the builder
 * will ensure that all subsequent configuration steps are properly typed.
 *
 * @template T - The form state type defining field names and their data types
 * @returns A new FormBuilder instance ready for configuration
 *
 * @example
 * ```tsx
 * // Define the shape of your form data
 * type CreateUserForm = {
 *   name: string
 *   email: string
 *   age: number
 *   isActive: boolean
 * }
 *
 * // Create a type-safe form builder
 * const userFormConfig = defineForm<CreateUserForm>()
 *   .ui({
 *     title: 'Create New User',
 *     icon: 'user-plus',
 *     onClose: () => setModalOpen(false),
 *     submitButton: 'create'
 *   })
 *   .typesMap({
 *     name: 'text',
 *     email: 'email',
 *     age: 'number',
 *     isActive: 'checkbox'
 *   })
 *   .setupFields({
 *     name: {
 *       label: 'Full Name',
 *       placeholder: 'Enter full name',
 *       required: true
 *     },
 *     email: {
 *       label: 'Email Address',
 *       placeholder: 'user@example.com',
 *       required: true
 *     },
 *     age: {
 *       label: 'Age',
 *       required: true
 *     },
 *     isActive: {
 *       label: 'Active User'
 *     }
 *   })
 *   .initialData({
 *     name: '',
 *     email: '',
 *     age: 0,
 *     isActive: true
 *   })
 *   .onSubmit(async (data) => {
 *     // data is fully typed as CreateUserForm
 *     await createUser(data)
 *   })
 *   .onChange((data) => {
 *     // Optional: handle real-time form changes
 *     console.log('Form changed:', data)
 *   })
 *   .build()
 *
 * // Use with FormModal component
 * function UserCreationModal({ isOpen, onClose }: Props) {
 *   return (
 *     <FormModal
 *       {...userFormConfig}
 *       isOpen={isOpen}
 *       onClose={onClose}
 *     />
 *   )
 * }
 * ```
 */
export default function defineForm<T extends FormState>(): FormBuilder<
  FlattenUnion<T>
> {
  return new FormBuilder<FlattenUnion<T>>()
}
