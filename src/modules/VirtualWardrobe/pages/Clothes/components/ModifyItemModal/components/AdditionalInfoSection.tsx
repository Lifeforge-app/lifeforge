import React from 'react'
import { Button } from '@components/buttons'
import { CurrencyInput , TextInput , ListboxOrComboboxInput , ListboxOrComboboxOption } from '@components/inputs'
import VW_COLORS from '@constants/virtual_wardrobe_colors'

function AdditionalInfoSection({
  step,
  setStep,
  size,
  setSize,
  colors,
  setColors,
  price,
  setPrice,
  notes,
  setNotes,
  submitButtonLoading,
  onSubmitButtonClick,
  openType
}: {
  step: number
  setStep: (value: number) => void
  size: string
  setSize: (value: string) => void
  colors: string[]
  setColors: (value: string[]) => void
  price: string
  setPrice: (value: string) => void
  notes: string
  setNotes: (value: string) => void
  submitButtonLoading: boolean
  onSubmitButtonClick: () => Promise<void>
  openType: 'create' | 'update' | null
}): React.ReactElement {
  return (
    <>
      <div className="mt-6 space-y-4">
        <TextInput
          icon="tabler:dimensions"
          name="Size"
          value={size}
          updateValue={setSize}
          darker
          placeholder='e.g. "M", "10"'
          required
        />
        <ListboxOrComboboxInput
          icon="tabler:palette"
          name="Color"
          value={colors}
          setValue={setColors}
          type="listbox"
          multiple
          required
          customActive={colors.length > 0}
          buttonContent={
            <div className="flex items-center gap-2">
              {colors.map(color => (
                <span
                  key={color}
                  className="size-4 rounded-full"
                  style={{
                    backgroundColor: VW_COLORS.find(c => c.name === color)?.hex
                  }}
                />
              ))}
            </div>
          }
        >
          {VW_COLORS.map(color => (
            <ListboxOrComboboxOption
              text={color.name}
              key={color.name}
              color={color.hex}
              value={color.name}
            />
          ))}
        </ListboxOrComboboxInput>
        <CurrencyInput
          icon="tabler:currency-dollar"
          name="Price"
          placeholder='e.g. "100.00"'
          value={price}
          updateValue={value => {
            setPrice(value ?? '')
          }}
          darker
        />
        <div className="mt-4 size-full rounded-lg bg-bg-200/70 p-6 shadow-custom transition-all focus-within:ring-1 focus-within:ring-bg-300 dark:bg-bg-800/50 dark:focus-within:ring-bg-500">
          <textarea
            className="h-max min-h-32 w-full resize-none bg-transparent caret-custom-500 placeholder:text-bg-500"
            placeholder="Any additional notes?"
            value={notes}
            onChange={e => {
              setNotes(e.target.value)
            }}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          variant="secondary"
          icon="tabler:arrow-left"
          onClick={() => {
            setStep(step - 1)
          }}
        >
          Previous
        </Button>
        <Button
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
          disabled={size === '' || colors.length === 0}
          loading={submitButtonLoading}
          onClick={() => {
            onSubmitButtonClick().catch(console.error)
          }}
        >
          {openType === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </>
  )
}

export default AdditionalInfoSection
