import { Icon } from '@iconify/react'
import { useState } from 'react'
import { toast } from 'react-toastify'

import {
  Button,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption,
  TextInput
} from '@lifeforge/ui'

import VW_CATEGORIES from '@modules/VirtualWardrobe/constants/virtual_wardrobe_categories'
import { IVirtualWardrobeFormState } from '@modules/VirtualWardrobe/interfaces/virtual_wardrobe_interfaces'

import fetchAPI from '@utils/fetchAPI'

function BasicInfoSection({
  canVision,
  frontImage,
  backImage,
  step,
  setStep,
  formState,
  setFormState,
  handleChange,
  canGoBack
}: {
  canVision: boolean
  frontImage: File | null
  backImage: File | null
  step: number
  setStep: (value: number) => void
  formState: IVirtualWardrobeFormState
  setFormState: (value: IVirtualWardrobeFormState) => void
  handleChange: (
    field: keyof IVirtualWardrobeFormState
  ) => (value: string | string[]) => void
  canGoBack: boolean
}) {
  const [visionLoading, setVisionLoading] = useState(false)

  async function onVision() {
    if (frontImage === null || backImage === null) {
      return
    }

    setVisionLoading(true)

    const formData = new FormData()
    formData.append('frontImage', frontImage)
    formData.append('backImage', backImage)

    try {
      const data = await fetchAPI<{
        name: string
        category: string
        subcategory: string
        colors: string[]
      }>('virtual-wardrobe/entries/vision', {
        method: 'POST',
        body: formData
      })

      const { name, category, subcategory, colors } = data
      setFormState({ ...formState, name, category, subcategory, colors })
    } catch {
      toast.error('Failed to identify item')
    } finally {
      setVisionLoading(false)
    }
  }

  return (
    <>
      <div className="mt-6 space-y-4">
        <TextInput
          darker
          required
          actionButtonIcon={canVision ? 'mage:stars-c' : undefined}
          actionButtonLoading={visionLoading}
          icon="tabler:shirt"
          name="Item Name"
          namespace="modules.virtualWardrobe"
          placeholder='e.g. "Blue Shirt"'
          setValue={handleChange('name')}
          value={formState.name}
          onActionButtonClick={() => {
            onVision().catch(console.error)
          }}
        />
        <ListboxOrComboboxInput
          required
          buttonContent={
            <>
              <Icon
                className="size-5"
                icon={
                  VW_CATEGORIES.find(l => l.name === formState.category)
                    ?.icon ?? 'tabler:apps-off'
                }
              />
              <span className="-mt-px block truncate">
                {VW_CATEGORIES.find(l => l.name === formState.category)?.name ??
                  'None'}
              </span>
            </>
          }
          icon="tabler:category"
          name="Category"
          namespace="modules.virtualWardrobe"
          setValue={(value: string) => {
            setFormState({ ...formState, category: value, subcategory: '' })
          }}
          type="listbox"
          value={formState.category}
        >
          <ListboxOrComboboxOption
            icon="tabler:apps-off"
            text="None"
            type="listbox"
            value={null}
          />
          {VW_CATEGORIES.map((category, i) => (
            <ListboxOrComboboxOption
              key={i}
              icon={category.icon}
              text={category.name}
              value={category.name}
            />
          ))}
        </ListboxOrComboboxInput>
        {formState.category && (
          <ListboxOrComboboxInput
            required
            buttonContent={
              <>
                <span className="-mt-px block truncate">
                  {formState.subcategory ?? 'None'}
                </span>
              </>
            }
            icon="tabler:tag"
            name="Subcategory"
            namespace="modules.virtualWardrobe"
            setValue={handleChange('subcategory')}
            type="listbox"
            value={formState.subcategory}
          >
            <ListboxOrComboboxOption text="None" type="listbox" value={null} />
            {VW_CATEGORIES.find(
              l => l.name === formState.category
            )?.subcategories?.map((subCategory, i) => (
              <ListboxOrComboboxOption
                key={i}
                text={subCategory}
                value={subCategory}
              />
            ))}
          </ListboxOrComboboxInput>
        )}
        <TextInput
          darker
          icon="tabler:settings-2"
          name="Brand"
          namespace="modules.virtualWardrobe"
          placeholder='e.g. "Nike"'
          setValue={handleChange('brand')}
          value={formState.brand}
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        {canGoBack && (
          <Button
            icon="tabler:arrow-left"
            variant="secondary"
            onClick={() => {
              setStep(step - 1)
            }}
          >
            Previous
          </Button>
        )}
        <Button
          iconAtEnd
          className={!canGoBack ? 'w-full' : ''}
          disabled={(['name', 'category', 'subcategory'] as const).some(
            key => !formState[key]
          )}
          icon="tabler:arrow-right"
          onClick={() => {
            setStep(step + 1)
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default BasicInfoSection
