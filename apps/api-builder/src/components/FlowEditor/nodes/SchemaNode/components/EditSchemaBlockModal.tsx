import { Icon } from '@iconify/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Button,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  ModalHeader,
  Switch,
  TextInput
} from '@lifeforge/ui'

import FIELD_TYPES from '../constants/field_types'
import type { ISchemaField, ISchemaNodeData } from '../types'

interface Props {
  onClose: () => void
  data: {
    schema: ISchemaNodeData
    onSave: (data: Omit<ISchemaNodeData, 'onUpdate'>) => void
  }
}

export default function EditSchemaNodeModal({
  onClose,
  data: { schema, onSave }
}: Props) {
  const { t } = useTranslation('core.apiBuilder')
  const [draft, setDraft] = useState<Omit<ISchemaNodeData, 'onUpdate'>>({
    name: schema.name,
    fields: schema.fields
  })

  const changeField = (idx: number, key: keyof ISchemaField, val: any) =>
    setDraft(prev => {
      const fields = [...prev.fields]
      fields[idx] = { ...fields[idx], [key]: val }
      return { ...prev, fields }
    })

  const addField = () =>
    setDraft(p => ({
      ...p,
      fields: [...p.fields, { name: '', type: 'string', isOptional: false }]
    }))

  const removeField = (i: number) =>
    setDraft(p => ({ ...p, fields: p.fields.filter((_, idx) => idx !== i) }))

  const save = () => {
    onSave(draft)
    onClose()
  }

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="tabler:pencil"
        title="Edit Schema Node"
        onClose={onClose}
        namespace="core.apiBuilder"
      />
      <div>
        <TextInput
          value={draft.name}
          setValue={val => setDraft(prev => ({ ...prev, name: val }))}
          placeholder="UserSchema"
          icon="tabler:braces"
          name="Schema Name"
          darker
          namespace="core.apiBuilder"
        />
      </div>
      <div className="mt-4 space-y-3">
        {draft.fields.map((f, i) => (
          <div
            key={i}
            className="border-bg-200 dark:border-bg-700 shadow-custom flex items-center gap-3 rounded-lg border-[1.8px] p-4"
          >
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3">
                <TextInput
                  className="flex-1"
                  value={f.name}
                  setValue={val => changeField(i, 'name', val)}
                  placeholder="fieldName"
                  darker
                  name="Field Name"
                  icon="tabler:id"
                  namespace="core.apiBuilder"
                />
                <ListboxOrComboboxInput
                  name="Field Type"
                  icon="tabler:category"
                  value={f.type}
                  type="listbox"
                  namespace="core.apiBuilder"
                  setValue={val => changeField(i, 'type', val)}
                  buttonContent={
                    <>
                      <Icon
                        icon={
                          FIELD_TYPES.find(
                            t => t.label.toLowerCase() === f.type
                          )?.icon || 'tabler:abc'
                        }
                        className="size-5"
                      />
                      <span>
                        {FIELD_TYPES.find(t => t.label.toLowerCase() === f.type)
                          ?.label || 'Select Type'}
                      </span>
                    </>
                  }
                >
                  {FIELD_TYPES.map(type => (
                    <ListboxOrComboboxOption
                      key={type.label}
                      value={type.label.toLowerCase()}
                      icon={type.icon}
                      text={type.label}
                    />
                  ))}
                </ListboxOrComboboxInput>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="size-6" icon="tabler:arrow-left-right" />
                  <span className="text-lg">{t('inputs.optional')}</span>
                </div>
                <Switch
                  checked={!!f.isOptional}
                  onChange={() => {
                    changeField(i, 'isOptional', !f.isOptional)
                  }}
                />
              </div>
            </div>
            <Button
              variant="plain"
              isRed
              onClick={() => removeField(i)}
              icon="tabler:trash"
            />
          </div>
        ))}

        {draft.fields.length === 0 && (
          <div className="text-bg-500 mt-4 text-center">
            {t('empty.noFields')}
          </div>
        )}
      </div>
      <Button
        variant="secondary"
        icon="tabler:plus"
        onClick={addField}
        className="mt-4 w-full"
        namespace="core.apiBuilder"
      >
        {t('inputs.addField')}
      </Button>

      <Button icon="uil:save" onClick={save} className="mt-6 w-full">
        Save
      </Button>
    </div>
  )
}
