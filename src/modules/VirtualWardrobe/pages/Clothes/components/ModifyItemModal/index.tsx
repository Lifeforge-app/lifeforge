import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ImagePickerModal } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import {
  IVirtualWardrobeFormData,
  type IVirtualWardrobeEntry
} from '@interfaces/virtual_wardrobe_interfaces'
import APIRequest from '@utils/fetchData'
import AdditionalInfoSection from './components/AdditionalInfoSection'
import BasicInfoSection from './components/BasicInfoSection'
import StepIndicator from './components/StepIndicator'
import UploadPhotoSection from './components/UploadPhotoSection'

function ModifyItemModal({
  openType,
  onClose,
  refreshEntries,
  existedData
}: {
  openType: 'create' | 'update' | null
  onClose: () => void
  refreshEntries: () => void
  existedData: IVirtualWardrobeEntry | null
}): React.ReactElement {
  const [step, setStep] = useState<number>(1)
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)

  const [formState, setFormState] = useState<IVirtualWardrobeFormData>({
    name: '',
    category: '',
    subcategory: '',
    brand: '',
    size: '',
    colors: [],
    price: '',
    notes: ''
  })

  const [openImagePickerFor, setOpenImagePickerFor] = useState<
    'front' | 'back' | null
  >(null)
  const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean>(false)

  function handleChange(field: keyof IVirtualWardrobeFormData) {
    return (value: string | string[]): void => {
      setFormState({ ...formState, [field]: value })
    }
  }

  async function onSubmit(): Promise<void> {
    if (
      (['name', 'category', 'subcategory', 'size', 'colors'] as const).some(
        key =>
          Array.isArray(formState[key])
            ? formState[key].length === 0
            : formState[key].trim() === ''
      ) ||
      (openType === 'create' && (frontImage === null || backImage === null))
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
        formData.append(key, value)
      }
    })

    if (frontImage !== null) formData.append('frontImage', frontImage)
    if (backImage !== null) formData.append('backImage', backImage)

    await APIRequest({
      endpoint:
        'virtual-wardrobe/entries' +
        (openType === 'update' ? `/${existedData?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body: openType === 'create' ? formData : formState,
      isJSON: openType === 'update',
      successInfo: openType,
      failureInfo: openType,
      callback: refreshEntries,
      finalCallback: () => {
        setSubmitButtonLoading(false)
        onClose()
      }
    })
  }

  useEffect(() => {
    if (openType === 'create') {
      setStep(1)
      setFormState({
        name: '',
        category: '',
        subcategory: '',
        brand: '',
        size: '',
        colors: [],
        price: '',
        notes: ''
      })
      setFrontImage(null)
      setBackImage(null)
      setFrontPreview(null)
      setBackPreview(null)
      setOpenImagePickerFor(null)
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
          price: existedData.price === 0 ? '' : existedData.price.toString(),
          notes: existedData.notes
        })
        setFrontImage(null)
        setBackImage(null)
        setFrontPreview(null)
        setBackPreview(null)
        setOpenImagePickerFor(null)
        setSubmitButtonLoading(false)
      }
    }
  }, [openType])

  return (
    <>
      <ModalWrapper isOpen={openType !== null} minWidth="50vw">
        <ModalHeader
          icon="tabler:plus"
          namespace="modules.virtualWardrobe"
          title={`item.${openType}`}
          onClose={onClose}
        />
        <StepIndicator openType={openType} step={step} />
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
                  setOpenImagePickerFor={setOpenImagePickerFor}
                  setStep={setStep}
                  step={step}
                />
              )
            case 2:
              return (
                <BasicInfoSection
                  backImage={backImage}
                  canGoBack={openType === 'create'}
                  canVision={openType === 'create'}
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
                  openType={openType}
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
      </ModalWrapper>
      <ImagePickerModal
        acceptedMimeTypes={{
          'image/*': ['jpg', 'jpeg', 'png', 'gif', 'webp']
        }}
        isOpen={openImagePickerFor !== null}
        onClose={() => {
          setOpenImagePickerFor(null)
        }}
        onSelect={async (file, preview) => {
          if (openImagePickerFor === 'front') {
            setFrontImage(file as File)
            setFrontPreview(preview)
          } else {
            setBackImage(file as File)
            setBackPreview(preview)
          }
        }}
      />
    </>
  )
}

export default ModifyItemModal
