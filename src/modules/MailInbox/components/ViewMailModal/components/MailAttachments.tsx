import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import FILE_ICONS from '@constants/file_icons'
import useThemeColors from '@hooks/useThemeColor'
import { IMailInboxEntry } from '@interfaces/mail_inbox_interfaces'
import { cleanFileSize } from '@utils/strings'

function MailAttachments({
  mail
}: {
  mail: IMailInboxEntry
}): React.ReactElement {
  const { componentBg } = useThemeColors()

  return (
    <div className="mt-6">
      <h3 className="flex items-center gap-2">
        <Icon className="size-5" icon="tabler:paperclip" />
        <span className="text-lg font-medium">Attachments</span>
        <span className="text-bg-500 text-sm">
          ({mail.attachments?.length})
        </span>
      </h3>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {mail.attachments?.map((attachment, index) => (
          <div
            key={index}
            className={clsx('shadow-custom gap-2 p-4', componentBg)}
          >
            <div className="flex-center aspect-square w-full">
              {[
                'jpg',
                'jpeg',
                'png',
                'gif',
                'webp',
                'bmp',
                'svg',
                'ico',
                'tiff',
                'tif',
                'raw'
              ].includes(
                attachment.file.split('.').pop()?.toLowerCase() || ''
              ) ? (
                <img
                  alt={attachment.name}
                  className="size-full object-contain object-center"
                  src={`${import.meta.env.VITE_API_HOST}/media/${
                    attachment.file
                  }`}
                />
              ) : (
                <Icon
                  className="text-bg-300 dark:text-bg-700 size-12"
                  icon={(() => {
                    const ext = attachment.file.split('.').pop()?.toLowerCase()

                    if (!ext) {
                      return 'tabler:file'
                    }

                    return (
                      FILE_ICONS[ext as keyof typeof FILE_ICONS] ||
                      'tabler:file'
                    )
                  })()}
                />
              )}
            </div>
            <div className="w-full min-w-0 truncate text-sm font-medium">
              {attachment.name}
            </div>
            <div className="text-bg-500 text-xs">
              {cleanFileSize(attachment.size)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MailAttachments
