import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { FormModal } from '@/components/form/components/FormModal'
import { NumberField } from '@/components/form/components/fields/NumberField'

export function SliderValueModal({
  onClose,
  data: { value, min = 0, max = 100, label, icon, onConfirm }
}: {
  onClose: () => void
  data: {
    value: number
    min?: number
    max?: number
    label?: string
    icon?: string
    onConfirm: (value: number) => void
  }
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const schema = useMemo(() => {
    let s = z.number()

    if (min !== undefined) {
      s = s.min(min, `Value must be at least ${min}`)
    }

    if (max !== undefined) {
      s = s.max(max, `Value must be at most ${max}`)
    }

    return z.object({
      value: s
    })
  }, [min, max])

  const form = useForm({
    defaultValues: {
      value
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        const input = containerRef.current.querySelector('input')

        if (input) {
          input.focus()
          input.select()
        }
      }
    }, 150)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  function handleSubmit(formData: { value: number }) {
    onConfirm(formData.value)
  }

  return (
    <div ref={containerRef}>
      <FormModal
        form={form}
        submissionConfig={{
          icon: 'tabler:check',
          label: 'Confirm',
          handler: handleSubmit
        }}
        uiConfig={{
          icon: icon || 'tabler:number',
          namespace: false,
          title: label || 'Enter Value',
          onClose
        }}
      >
        <NumberField
          autoFocus
          control={form.control}
          icon={icon || 'tabler:number'}
          label={label || 'Value'}
          max={max}
          min={min}
          name="value"
          namespace={false}
          onEnter={() => {
            form.handleSubmit(handleSubmit)().then(onClose)
          }}
        />
      </FormModal>
    </div>
  )
}
