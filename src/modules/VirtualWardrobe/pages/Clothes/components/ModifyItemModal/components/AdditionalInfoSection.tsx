import React from 'react'
import { Button } from '@components/buttons'
import {
  CurrencyInput,
  TextInput,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import VW_COLORS from '@constants/virtual_wardrobe_colors'
import { IVirtualWardrobeFormState } from '@interfaces/virtual_wardrobe_interfaces'

function AdditionalInfoSection({
  step,
  setStep,
  submitButtonLoading,
  onSubmitButtonClick,
  openType,
  formState,
  handleChange
}: {
  step: number
  setStep: (value: number) => void
  submitButtonLoading: boolean
  onSubmitButtonClick: () => Promise<void>
  openType: 'create' | 'update' | null
  formState: IVirtualWardrobeFormState
  handleChange: (
    field: keyof IVirtualWardrobeFormState
  ) => (value: string | string[]) => void
}): React.ReactElement {
  return (
    <>
      <div className="mt-6 space-y-4">
        <TextInput
          darker
          required
          icon="tabler:dimensions"
          name="Size"
          namespace="modules.virtualWardrobe"
          placeholder='e.g. "M", "10"'
          setValue={handleChange('size')}
          value={formState.size}
        />
        <ListboxOrComboboxInput
          multiple
          required
          buttonContent={
            <div className="flex items-center gap-2">
              {formState.colors.map(color => (
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
          customActive={formState.colors.length > 0}
          icon="tabler:palette"
          name="Color"
          namespace="modules.virtualWardrobe"
          setValue={handleChange('colors')}
          type="listbox"
          value={formState.colors}
        >
          {VW_COLORS.map(color => (
            <ListboxOrComboboxOption
              key={color.name}
              color={color.hex}
              text={color.name}
              value={color.name}
            />
          ))}
        </ListboxOrComboboxInput>
        <CurrencyInput
          darker
          icon="tabler:currency-dollar"
          name="Price"
          namespace="modules.virtualWardrobe"
          placeholder='e.g. "100.00"'
          setValue={handleChange('price')}
          value={formState.price}
        />
        <div className="mt-4 size-full rounded-lg bg-bg-200/70 p-6 shadow-custom transition-all focus-within:ring-1 focus-within:ring-bg-300 dark:bg-bg-800/50 dark:focus-within:ring-bg-500">
          <textarea
            className="h-max min-h-32 w-full resize-none bg-transparent caret-custom-500 placeholder:text-bg-500"
            placeholder="Any additional notes?"
            value={formState.notes}
            onChange={e => handleChange('notes')(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          icon="tabler:arrow-left"
          variant="secondary"
          onClick={() => {
            setStep(step - 1)
          }}
        >
          Previous
        </Button>
        <Button
          disabled={formState.size === '' || formState.colors.length === 0}
          icon={openType === 'create' ? 'tabler:plus' : 'tabler:pencil'}
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
