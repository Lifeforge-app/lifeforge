interface ITextInputFieldProps {
  label: string
  icon: string
  type: 'text'
  placeholder: string
  disabled?: boolean
}

interface IDateInputFieldProps {
  label: string
  icon: string
  type: 'date'
  index: number
  modalRef: React.RefObject<HTMLInputElement | null>
}

interface IListboxInputFieldProps {
  label: string
  icon: string
  type: 'listbox'
  options: Array<{
    value: string
    text: string
    icon?: string
    color?: string
  }>
  nullOption?: string
  multiple?: boolean
}

interface IColorInputFieldProps {
  label: string
  type: 'color'
}

interface IIconInputFieldProps {
  label: string
  type: 'icon'
}

type IFieldProps = (
  | ITextInputFieldProps
  | IDateInputFieldProps
  | IListboxInputFieldProps
  | IColorInputFieldProps
  | IIconInputFieldProps
) & {
  id: string
}

export type { IFieldProps }
