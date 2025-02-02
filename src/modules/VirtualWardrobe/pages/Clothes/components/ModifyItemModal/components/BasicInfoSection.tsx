import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import {
  TextInput,
  ListboxOrComboboxInput,
  ListboxOrComboboxOption
} from '@components/inputs'
import VW_CATEGORIES from '@constants/virtual_wardrobe_categories'
import APIRequest from '@utils/fetchData'

function BasicInfoSection({
  canVision,
  frontImage,
  backImage,
  step,
  setStep,
  name,
  setName,
  category,
  setCategory,
  subCategory,
  setSubCategory,
  brand,
  setBrand,
  setColors,
  canGoBack
}: {
  canVision: boolean
  frontImage: File | null
  backImage: File | null
  step: number
  setStep: (value: number) => void
  name: string
  setName: (value: string) => void
  category: string | null
  setCategory: (value: string | null) => void
  subCategory: string | null
  setSubCategory: (value: string | null) => void
  brand: string
  setBrand: (value: string) => void
  setColors: (value: string[]) => void
  canGoBack: boolean
}): React.ReactElement {
  const [visionLoading, setVisionLoading] = useState(false)

  async function onVision(): Promise<void> {
    if (frontImage === null || backImage === null) {
      return
    }

    setVisionLoading(true)

    const formData = new FormData()
    formData.append('frontImage', frontImage)
    formData.append('backImage', backImage)

    await APIRequest({
      method: 'POST',
      endpoint: 'virtual-wardrobe/entries/vision',
      body: formData,
      isJSON: false,
      callback: data => {
        const { name, category, subcategory, colors } = data.data
        setName(name)
        setCategory(category)
        setSubCategory(subcategory)
        setColors(colors)
      },
      failureInfo: 'identify',
      finalCallback: () => {
        setVisionLoading(false)
      }
    })
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
          updateValue={setName}
          value={name}
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
                  VW_CATEGORIES.find(l => l.name === category)?.icon ??
                  'tabler:apps-off'
                }
              />
              <span className="-mt-px block truncate">
                {VW_CATEGORIES.find(l => l.name === category)?.name ?? 'None'}
              </span>
            </>
          }
          icon="tabler:category"
          name="Category"
          namespace="modules.virtualWardrobe"
          setValue={(value: string | null) => {
            setCategory(value)
            setSubCategory(null)
          }}
          type="listbox"
          value={category}
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
        {category !== null && (
          <ListboxOrComboboxInput
            required
            buttonContent={
              <>
                <span className="-mt-px block truncate">
                  {subCategory ?? 'None'}
                </span>
              </>
            }
            icon="tabler:tag"
            name="Subcategory"
            namespace="modules.virtualWardrobe"
            setValue={setSubCategory}
            type="listbox"
            value={subCategory}
          >
            <ListboxOrComboboxOption text="None" type="listbox" value={null} />
            {VW_CATEGORIES.find(l => l.name === category)?.subcategories?.map(
              (subCategory, i) => (
                <ListboxOrComboboxOption
                  key={i}
                  text={subCategory}
                  value={subCategory}
                />
              )
            )}
          </ListboxOrComboboxInput>
        )}
        <TextInput
          darker
          icon="tabler:settings-2"
          name="Brand"
          namespace="modules.virtualWardrobe"
          placeholder='e.g. "Nike"'
          updateValue={setBrand}
          value={brand}
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
          disabled={name === '' || category === null || subCategory === null}
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
