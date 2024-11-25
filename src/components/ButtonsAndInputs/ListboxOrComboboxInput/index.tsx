import { ComboboxInput, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import ComboboxInputWrapper from './components/ComboboxInputWrapper'
import ListboxInputWrapper from './components/ListboxInputWrapper'
import ListboxOrComboboxOptions from './components/ListboxOrComboboxOptions'
import InputIcon from '../Input/components/InputIcon'
import InputLabel from '../Input/components/InputLabel'

interface IGeneralProps {
  name: string
  icon: string
  value: any
  setValue: (value: any) => void
  children: React.ReactNode
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
  customActive?: boolean
}

type IListboxOrComboboxInputProps = IListboxProps | IComboboxProps

function ListboxOrComboboxInput(
  props: IListboxOrComboboxInputProps
): React.ReactElement {
  const { name, icon, value, setValue, type, children } = props

  switch (type) {
    case 'listbox':
    case undefined:
      return (
        <ListboxInputWrapper
          value={value}
          onChange={setValue}
          multiple={props.multiple}
        >
          <ListboxButton className="group flex w-full items-center">
            <Icon
              icon={icon}
              className={`ml-6 size-6 shrink-0 ${
                value !== null && value.length !== 0 ? '' : 'text-bg-500'
              } group-data-[open]:!text-custom-500`}
            />
            <span
              className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-data-[open]:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
            >
              {name}
            </span>
            <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none">
              {props.buttonContent}
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
              icon={icon}
              active={
                (value !== null && value.length !== 0) ||
                props.customActive === true
              }
            />
            <InputLabel
              label={name}
              active={
                (value !== null && value.length !== 0) ||
                props.customActive === true
              }
            />
            <ComboboxInput
              displayValue={props.displayValue}
              onChange={(e: any) => {
                props.setQuery(e.target.value)
              }}
              className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg !bg-transparent px-5 text-left focus:outline-none"
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
