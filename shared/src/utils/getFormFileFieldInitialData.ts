import type { ForgeAPIClientController } from '@shared/api/core/forgeAPIClient'
import type { ClientTree } from '@shared/api/typescript/forge_api_client.types'

export default function getFormFileFieldInitialData(
  forgeAPI: ClientTree<any>,
  initialData: any,
  file: File | string | null | undefined
) {
  if (!file) {
    return {
      file: null,
      preview: null
    }
  }

  let finalFile

  if (typeof file === 'string' && file.length > 0) {
    // Keep existing file reference
    finalFile = 'keep'
  } else if ((file as File | undefined) instanceof File) {
    // New file uploaded
    finalFile = file
  } else {
    // Just a fallback
    finalFile = null
  }

  let preview: string | null = null

  if (typeof file === 'string') {
    // Generate preview URL for existing file
    if (file.match(/^.*?(png|jpe?g|webp|gif)$/i)) {
      preview = (forgeAPI.media! as ForgeAPIClientController).input({
        collectionId: initialData.collectionId!,
        recordId: initialData.id!,
        fieldId: file
      } as never).endpoint
    } else {
      preview = file
    }
  } else if (file instanceof File && file.type.startsWith('image/')) {
    // Generate preview URL for new image file
    preview = URL.createObjectURL(file)
  }

  return {
    file: finalFile,
    preview
  }
}
