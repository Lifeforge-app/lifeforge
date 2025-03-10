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
  namespace: string | false
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
  const { t } = useTranslation(namespace ? namespace : undefined)

  switch (type) {
    case 'listbox':
    case undefined:
      return (
        <ListboxInputWrapper
          className={props.className}
          multiple={props.multiple}
          value={value}
          onChange={setValue}
        >
          <ListboxButton className="group flex w-full items-center pl-6">
            <InputIcon
              active={
                (value !== null && value.length !== 0) || customActive === true
              }
              icon={icon}
              listboxOrCombobox="listbox"
            />
            <InputLabel
              isListboxOrCombobox
              active={
                (value !== null && value.length !== 0) || customActive === true
              }
              label={t(
                namespace !== false
                  ? t([
                      [tKey, 'inputs', toCamelCase(name), 'label']
                        .filter(e => e)
                        .join('.'),
                      [tKey, 'inputs', toCamelCase(name)]
                        .filter(e => e)
                        .join('.')
                    ])
                  : name
              )}
              required={required === true}
            />
            <div className="relative mt-10 mb-3 flex min-h-[1.2rem] w-full items-center gap-2 rounded-lg pr-10 pl-5 text-left focus:outline-hidden">
              {((value !== null && value.length !== 0) ||
                props.customActive === true) &&
                props.buttonContent}
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 mr-2 flex items-center pr-4">
              <Icon
                className="size-5 text-zinc-500"
                icon="tabler:chevron-down"
              />
            </span>
          </ListboxButton>
          <ListboxOrComboboxOptions>{children}</ListboxOrComboboxOptions>
        </ListboxInputWrapper>
      )
    case 'combobox':
      return (
        <ComboboxInputWrapper
          className={props.className}
          setQuery={props.setQuery}
          value={value}
          onChange={setValue}
        >
          <div className="group relative flex w-full items-center">
            <InputIcon
              active={
                (value !== null && value.length !== 0) || customActive === true
              }
              className="absolute left-6"
              icon={icon}
              listboxOrCombobox="combobox"
            />
            <InputLabel
              isCombobox
              isListboxOrCombobox
              active={
                (value !== null && value.length !== 0) || customActive === true
              }
              label={t(`inputs.${toCamelCase(name)}`)}
              required={required === true}
            />
            <ComboboxInput
              className="relative mt-10 mb-3 flex w-full items-center gap-2 rounded-lg bg-transparent! pr-5 pl-17.5 text-left focus:outline-hidden"
              displayValue={props.displayValue}
              onChange={(e: any) => {
                props.setQuery(e.target.value)
              }}
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
