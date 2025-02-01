import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { ImagePickerModal } from '@components/inputs'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import { type IVirtualWardrobeEntry } from '@interfaces/virtual_wardrobe_interfaces'
import APIRequest from '@utils/fetchData'
import { toCamelCase } from '@utils/strings'
import AdditionalInfoSection from './components/AdditionalInfoSection'
import BasicInfoSection from './components/BasicInfoSection'
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
  const { t } = useTranslation('modules.virtualWardrobe')
  const [step, setStep] = useState<number>(1)
  const [name, setName] = useState<string>('')
  const [category, setCategory] = useState<string | null>(null)
  const [subCategory, setSubCategory] = useState<string | null>(null)
  const [brand, setBrand] = useState<string>('')
  const [size, setSize] = useState<string>('')
  const [colors, setColors] = useState<string[]>([])
  const [price, setPrice] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [frontPreview, setFrontPreview] = useState<string | null>(null)
  const [backPreview, setBackPreview] = useState<string | null>(null)
  const [openImagePickerFor, setOpenImagePickerFor] = useState<
    'front' | 'back' | null
  >(null)
  const [submitButtonLoading, setSubmitButtonLoading] = useState<boolean>(false)

  async function onSubmit(): Promise<void> {
    if (
      name.trim() === '' ||
      category === '' ||
      subCategory === '' ||
      colors.length === 0 ||
      size.trim() === '' ||
      (openType === 'create' && (frontImage === null || backImage === null))
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitButtonLoading(true)

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('category', category ?? '')
    formData.append('subcategory', subCategory ?? '')
    formData.append('brand', brand.trim())
    formData.append('size', size.trim())
    formData.append('colors', JSON.stringify(colors))
    formData.append('price', price)
    formData.append('notes', notes.trim())
    if (frontImage !== null) formData.append('frontImage', frontImage)
    if (backImage !== null) formData.append('backImage', backImage)

    await APIRequest({
      endpoint:
        'virtual-wardrobe/entries' +
        (openType === 'update' ? `/${existedData?.id}` : ''),
      method: openType === 'create' ? 'POST' : 'PATCH',
      body:
        openType === 'create'
          ? formData
          : {
              name: name.trim(),
              category: category ?? '',
              subcategory: subCategory ?? '',
              brand: brand.trim(),
              size: size.trim(),
              colors,
              price: price === '' ? 0 : parseFloat(price),
              notes: notes.trim()
            },
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
      setName('')
      setCategory(null)
      setSubCategory(null)
      setBrand('')
      setSize('')
      setColors([])
      setPrice('')
      setNotes('')
      setFrontImage(null)
      setBackImage(null)
      setFrontPreview(null)
      setBackPreview(null)
      setOpenImagePickerFor(null)
      setSubmitButtonLoading(false)
    } else {
      if (existedData !== null) {
        setStep(2)
        setName(existedData.name)
        setCategory(existedData.category)
        setSubCategory(existedData.subcategory)
        setBrand(existedData.brand)
        setSize(existedData.size)
        setColors(existedData.colors)
        setPrice(existedData.price === 0 ? '' : existedData.price.toString())
        setNotes(existedData.notes)
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
          title={`item.${openType}`}
          namespace="modules.virtualWardrobe"
          onClose={onClose}
          icon="tabler:plus"
        />
        <ol className="flex w-full items-center text-sm font-medium text-bg-500 sm:text-base">
          {['Upload Photos', 'Basic Info', 'Appearance And Details'].map(
            (text, index) => (
              <li
                key={index}
                className={`flex items-center ${
                  index + 1 <= step ? 'text-custom-500' : 'text-bg-500'
                } ${
                  index !== 2 &&
                  `after:mx-4 after:hidden after:h-0.5 after:w-full ${
                    index + 1 < step
                      ? 'after:bg-custom-500'
                      : 'after:bg-bg-300 dark:after:bg-bg-700'
                  } sm:after:inline-block sm:after:content-[''] md:w-full xl:after:mx-4`
                }`}
              >
                <div className="flex items-center whitespace-nowrap after:mx-2 after:content-['/'] sm:after:hidden ">
                  <span
                    className={`mr-3 flex size-6 items-center justify-center rounded-full font-medium lg:size-10 ${(() => {
                      if (index + 1 === step) {
                        return 'border-2 border-custom-500'
                      }

                      if (index + 1 < step) {
                        return 'bg-custom-500 text-bg-900'
                      }

                      return 'bg-bg-500 text-bg-100 dark:text-bg-900'
                    })()}`}
                  >
                    {openType === 'update' && index === 0 ? (
                      <Icon icon="tabler:lock" className="size-5" />
                    ) : (
                      index + 1
                    )}
                  </span>{' '}
                  {t(`steps.${toCamelCase(text)}`)}
                </div>
              </li>
            )
          )}
        </ol>
        {(() => {
          switch (step) {
            case 1:
              return (
                <UploadPhotoSection
                  step={step}
                  setStep={setStep}
                  frontImage={frontImage}
                  setFrontImage={setFrontImage}
                  backImage={backImage}
                  setBackImage={setBackImage}
                  frontPreview={frontPreview}
                  setFrontPreview={setFrontPreview}
                  backPreview={backPreview}
                  setBackPreview={setBackPreview}
                  setOpenImagePickerFor={setOpenImagePickerFor}
                />
              )
            case 2:
              return (
                <BasicInfoSection
                  canVision={openType === 'create'}
                  frontImage={frontImage}
                  backImage={backImage}
                  step={step}
                  setStep={setStep}
                  name={name}
                  setName={setName}
                  category={category}
                  setCategory={setCategory}
                  subCategory={subCategory}
                  setSubCategory={setSubCategory}
                  brand={brand}
                  setBrand={setBrand}
                  setColors={setColors}
                  canGoBack={openType === 'create'}
                />
              )
            case 3:
              return (
                <AdditionalInfoSection
                  step={step}
                  setStep={setStep}
                  size={size}
                  setSize={setSize}
                  colors={colors}
                  setColors={setColors}
                  price={price}
                  setPrice={setPrice}
                  notes={notes}
                  setNotes={setNotes}
                  submitButtonLoading={submitButtonLoading}
                  onSubmitButtonClick={onSubmit}
                  openType={openType}
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
