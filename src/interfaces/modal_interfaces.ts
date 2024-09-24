interface ITextInputFieldProps {
  name: string
  icon: string
  type: 'text'
  placeholder: string
}

interface IDateInputFieldProps {
  name: string
  icon: string
  type: 'date'
  index: number
  modalRef: React.RefObject<HTMLInputElement | null>
}

interface IListboxInputFieldProps {
  name: string
  icon: string
  type: 'listbox'
  options: Array<{
    value: string
    text: string
    icon?: string
    color?: string
  }>
  nullOption: string
}

interface IColorInputFieldProps {
  name: string
  type: 'color'
}

interface IIconInputFieldProps {
  name: string
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
