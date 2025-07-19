import { useQueryClient } from '@tanstack/react-query'
import { ModalHeader } from 'lifeforge-ui'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import {
  type IVirtualWardrobeEntry,
  IVirtualWardrobeFormState
} from '../../../../interfaces/virtual_wardrobe_interfaces'
import AdditionalInfoSection from './components/AdditionalInfoSection'
import BasicInfoSection from './components/BasicInfoSection'
import StepIndicator from './components/StepIndicator'
import UploadPhotoSection from './components/UploadPhotoSection'

function ModifyItemModal({
  onClose,
  data: { type, existedData }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    existedData: IVirtualWardrobeEntry | null
  }
}) {
  const queryClient = useQueryClient()

  const [step, setStep] = useState<number>(1)

  const [frontImage, setFrontImage] = useState<File | null>(null)

  const [backImage, setBackImage] = useState<File | null>(null)

  const [frontPreview, setFrontPreview] = useState<string | null>(null)

  const [backPreview, setBackPreview] = useState<string | null>(null)

  const [formState, setFormState] = useState<IVirtualWardrobeFormState>({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    size: '',
    colors: [],
    price: 0,
    notes: ''
  })

  const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean>(false)

  function handleChange(field: keyof IVirtualWardrobeFormState) {
    return (value: string | string[] | number) => {
      setFormState({ ...formState, [field]: value })
    }
  }

  async function onSubmit() {
    if (
      (['name', 'category', 'subcategory', 'size', 'colors'] as const).some(
        key =>
          Array.isArray(formState[key])
            ? formState[key].length === 0
            : formState[key].trim() === ''
      ) ||
      (type === 'create' && (frontImage === null || backImage === null))
    ) {
      toast.error('Please fill in all required fields')

      return
    }

    setSubmitButtonLoading(true)

    const formData = new FormData()

    Object.entries(formState).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value))
      } else {
        formData.append(key, value as string)
      }
    })

    if (frontImage !== null) formData.append('frontImage', frontImage)
    if (backImage !== null) formData.append('backImage', backImage)

    try {
      const data = await fetchAPI<IVirtualWardrobeEntry>(
        import.meta.env.VITE_API_HOST,
        'virtual-wardrobe/entries' +
          (type === 'update' ? `/${existedData?.id}` : ''),
        {
          method: type === 'create' ? 'POST' : 'PATCH',
          body:
            type === 'create'
              ? formData
              : (formState as Record<string, unknown>)
        }
      )

      queryClient.setQueryData<IVirtualWardrobeEntry[]>(
        ['virtual-wardrobe'],
        old => {
          if (type === 'create') {
            return old ? [...old, data] : [data]
          } else {
            return old?.map(item => (item.id === data.id ? data : item)) ?? []
          }
        }
      )
      queryClient.invalidateQueries({
        queryKey: ['virtual-wardrobe', 'sidebar-data']
      })

      onClose()
    } catch {
      toast.error('Failed to update item data')
    } finally {
      setSubmitButtonLoading(false)
    }
  }

  useEffect(() => {
    if (type === 'create') {
      setStep(1)
      setFormState({
        name: '',
        category: '',
        subcategory: '',
        brand: '',
        size: '',
        colors: [],
        price: 0,
        notes: ''
      })
      setFrontImage(null)
      setBackImage(null)
      setFrontPreview(null)
      setBackPreview(null)
      setSubmitButtonLoading(false)
    } else {
      if (existedData !== null) {
        setStep(2)
        setFormState({
          name: existedData.name,
          category: existedData.category,
          subcategory: existedData.subcategory,
          brand: existedData.brand,
          size: existedData.size,
          colors: existedData.colors,
          price: existedData.price,
          notes: existedData.notes
        })
        setFrontImage(null)
        setBackImage(null)
        setFrontPreview(null)
        setBackPreview(null)
        setSubmitButtonLoading(false)
      }
    }
  }, [type])

  return (
    <div className="min-w-[50vw]">
      <ModalHeader
        icon="tabler:plus"
        namespace="apps.virtualWardrobe"
        title={`item.${type}`}
        onClose={onClose}
      />
      <StepIndicator openType={type} step={step} />
      {(() => {
        switch (step) {
          case 1:
            return (
              <UploadPhotoSection
                backImage={backImage}
                backPreview={backPreview}
                frontImage={frontImage}
                frontPreview={frontPreview}
                setBackImage={setBackImage}
                setBackPreview={setBackPreview}
                setFrontImage={setFrontImage}
                setFrontPreview={setFrontPreview}
                setStep={setStep}
                step={step}
              />
            )
          case 2:
            return (
              <BasicInfoSection
                backImage={backImage}
                canGoBack={type === 'create'}
                canVision={type === 'create'}
                formState={formState}
                frontImage={frontImage}
                handleChange={handleChange}
                setFormState={setFormState}
                setStep={setStep}
                step={step}
              />
            )
          case 3:
            return (
              <AdditionalInfoSection
                formState={formState}
                handleChange={handleChange}
                openType={type}
                setStep={setStep}
                step={step}
                submitButtonLoading={submitButtonLoading}
                onSubmitButtonClick={onSubmit}
              />
            )
          default:
            return <></>
        }
      })()}
    </div>
  )
}

export default ModifyItemModal
