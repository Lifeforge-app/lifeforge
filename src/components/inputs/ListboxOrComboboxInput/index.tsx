import { ComboboxInput, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'
import ComboboxInputWrapper from './components/ComboboxInputWrapper'
import ListboxInputWrapper from './components/ListboxInputWrapper'
import ListboxOrComboboxOptions from './components/ListboxOrComboboxOptions'
import InputIcon from '../shared/InputIcon'
import InputLabel from '../shared/InputLabel'

interface IGeneralProps {
  name: string
  icon: string
  value: any
  setValue: (value: any) => void
  className?: string
  children: React.ReactNode
  customActive?: boolean
  required?: boolean
  namespace: string
  tKey?: string
}

interface IListboxProps extends IGeneralProps {
  type: 'listbox'
  buttonContent: React.ReactElement
  multiple?: boolean
}

interface IComboboxProps extends IGeneralProps {
  type: 'combobox'
  setQuery: (query: string) => void
  displayValue: (value: any) => string
}

type IListboxOrComboboxInputProps = IListboxProps | IComboboxProps

function ListboxOrComboboxInput(
  props: IListboxOrComboboxInputProps
): React.ReactElement {
  const {
    name,
    icon,
    value,
    setValue,
    type,
    children,
    required,
    customActive,
    namespace,
    tKey = ''
  } = props
  const { t } = useTranslation(namespace)

  switch (type) {
    case 'listbox':
    case undefined:
      return (
        <ListboxInputWrapper
          value={value}
          onChange={setValue}
          multiple={props.multiple}
          className={props.className}
        >
          <ListboxButton className="group flex w-full items-center">
            <InputIcon
              isListbox
              icon={icon}
              active={
                (value !== null && value.length !== 0) || customActive === true
              }
            />
            <InputLabel
              label={t(
                [tKey, 'inputs', toCamelCase(name)].filter(e => e).join('.')
              )}
              required={required === true}
              isListbox
              active={
                (value !== null && value.length !== 0) || customActive === true
              }
            />
            <div className="relative mb-3 mt-10 flex min-h-[1.2rem] w-full items-center gap-2 rounded-lg pl-3 pr-10 text-left focus:outline-hidden">
              {((value !== null && value.length !== 0) ||
                props.customActive === true) &&
                props.buttonContent}
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 mr-2 mt-1 flex items-center pr-4">
              <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
            </span>
          </ListboxButton>
          <ListboxOrComboboxOptions>{children}</ListboxOrComboboxOptions>
        </ListboxInputWrapper>
      )
    case 'combobox':
      return (
        <ComboboxInputWrapper
          value={value}
          onChange={setValue}
          setQuery={props.setQuery}
        >
          <div className="group flex w-full items-center">
            <InputIcon
              isListbox
              icon={icon}
              active={
                (value !== null && value.length !== 0) || customActive === true
              }
            />
            <InputLabel
              label={t(`inputs.${toCamelCase(name)}`)}
              required={required === true}
              isListbox
              active={
                (value !== null && value.length !== 0) || customActive === true
              }
            />
            <ComboboxInput
              displayValue={props.displayValue}
              onChange={(e: any) => {
                props.setQuery(e.target.value)
              }}
              className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg bg-transparent! px-5 text-left focus:outline-hidden"
            />
          </div>
          <ListboxOrComboboxOptions type="combobox">
            {children}
          </ListboxOrComboboxOptions>
        </ComboboxInputWrapper>
      )
  }
}

export default ListboxOrComboboxInput
