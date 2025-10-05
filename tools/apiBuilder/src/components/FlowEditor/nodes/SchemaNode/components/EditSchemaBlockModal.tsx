import { Icon } from '@iconify/react'
import {
  Button,
  ListboxInput,
  ListboxOption,
  ModalHeader,
  Switch,
  TextInput
} from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('apps.apiBuilder')

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
    setDraft(p => ({
      ...p,
      fields: p.fields.filter((_, idx) => idx !== i)
    }))

  const save = () => {
    onSave(draft)
    onClose()
  }

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="tabler:pencil"
        namespace="apps.apiBuilder"
        title="Edit Schema Node"
        onClose={onClose}
      />
      <div>
        <TextInput
          icon="tabler:braces"
          label="Schema Name"
          namespace="apps.apiBuilder"
          placeholder="UserSchema"
          setValue={val => setDraft(prev => ({ ...prev, name: val }))}
          value={draft.name}
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
                  icon="tabler:id"
                  label="Field Name"
                  namespace="apps.apiBuilder"
                  placeholder="fieldName"
                  setValue={val => changeField(i, 'name', val)}
                  value={f.name}
                />
                <ListboxInput
                  buttonContent={
                    <>
                      <Icon
                        className="size-5"
                        icon={
                          FIELD_TYPES.find(
                            t => t.label.toLowerCase() === f.type
                          )?.icon || 'tabler:abc'
                        }
                      />
                      <span>
                        {FIELD_TYPES.find(t => t.label.toLowerCase() === f.type)
                          ?.label || 'Select Type'}
                      </span>
                    </>
                  }
                  icon="tabler:category"
                  label="Field Type"
                  namespace="apps.apiBuilder"
                  setValue={val => changeField(i, 'type', val)}
                  value={f.type}
                >
                  {FIELD_TYPES.map(type => (
                    <ListboxOption
                      key={type.label}
                      icon={type.icon}
                      label={type.label}
                      value={type.label.toLowerCase()}
                    />
                  ))}
                </ListboxInput>
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
              dangerous
              icon="tabler:trash"
              variant="plain"
              onClick={() => removeField(i)}
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
        className="mt-4 w-full"
        icon="tabler:plus"
        namespace="apps.apiBuilder"
        variant="secondary"
        onClick={addField}
      >
        {t('inputs.addField')}
      </Button>

      <Button className="mt-6 w-full" icon="uil:save" onClick={save}>
        Save
      </Button>
    </div>
  )
}
