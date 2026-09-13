import type EPub from 'epub2'

const getEpubThumbnail = (epubInstance: EPub): Promise<File | undefined> => {
  return new Promise((resolve, reject) => {
    const coverId = epubInstance
      .listImage()
      .find(item => item.id?.toLowerCase().includes('cover'))?.id

    if (!coverId) {
      return resolve(undefined)
    }

    epubInstance.getImage(coverId, (error, data, MimeType) => {
      if (error) {
        return reject(error)
      }

      if (!data) {
        return resolve(undefined)
      }

      const file = new File([Buffer.from(data)], 'cover.jpg', {
        type: MimeType
      })

      resolve(file)
    })
  })
}

export default getEpubThumbnail
