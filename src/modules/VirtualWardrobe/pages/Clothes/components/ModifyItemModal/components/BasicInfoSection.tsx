import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useState } from 'react'
import { Button } from '@components/buttons'
import { TextInput , ListboxOrComboboxInput , ListboxOrComboboxOption } from '@components/inputs'
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
          icon="tabler:shirt"
          name="Item Name"
          value={name}
          updateValue={setName}
          darker
          placeholder='e.g. "Blue Shirt"'
          required
          actionButtonIcon={canVision ? 'mage:stars-c' : undefined}
          actionButtonLoading={visionLoading}
          onActionButtonClick={() => {
            onVision().catch(console.error)
          }}
        />
        <ListboxOrComboboxInput
          type="listbox"
          name="Category"
          value={category}
          setValue={(value: string | null) => {
            setCategory(value)
            setSubCategory(null)
          }}
          icon="tabler:category"
          required
          buttonContent={
            <>
              <Icon
                icon={
                  VW_CATEGORIES.find(l => l.name === category)?.icon ??
                  'tabler:apps-off'
                }
                className="size-5"
              />
              <span className="-mt-px block truncate">
                {VW_CATEGORIES.find(l => l.name === category)?.name ?? 'None'}
              </span>
            </>
          }
        >
          <ListboxOrComboboxOption
            type="listbox"
            icon="tabler:apps-off"
            text="None"
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
            type="listbox"
            name="Sub Category"
            value={subCategory}
            setValue={setSubCategory}
            icon="tabler:tag"
            required
            buttonContent={
              <>
                <span className="-mt-px block truncate">
                  {subCategory ?? 'None'}
                </span>
              </>
            }
          >
            <ListboxOrComboboxOption type="listbox" text="None" value={null} />
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
          icon="tabler:settings-2"
          name="Brand"
          value={brand}
          updateValue={setBrand}
          darker
          placeholder='e.g. "Nike"'
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        {canGoBack && (
          <Button
            variant="secondary"
            icon="tabler:arrow-left"
            onClick={() => {
              setStep(step - 1)
            }}
          >
            Previous
          </Button>
        )}
        <Button
          className={!canGoBack ? 'w-full' : ''}
          onClick={() => {
            setStep(step + 1)
          }}
          disabled={name === '' || category === null || subCategory === null}
          icon="tabler:arrow-right"
          iconAtEnd
        >
          Next
        </Button>
      </div>
    </>
  )
}

export default BasicInfoSection
