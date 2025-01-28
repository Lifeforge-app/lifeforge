import DOMPurify from 'dompurify'
import React, { useMemo } from 'react'
import { IMailInboxEntry } from '@interfaces/mail_inbox_interfaces'

function MailContent({ mail }: { mail: IMailInboxEntry }): React.ReactElement {
  const content = useMemo(
    () =>
      DOMPurify.sanitize(
        (() => {
          if (mail.html !== 'false') {
            return mail.html
          }

          if (mail.text.trim()) {
            return mail.text.trim()
          }

          return '<p>No content</p>'
        })()
      ),
    [mail]
  )

  return (
    <div
      className="mail-content w-full"
      dangerouslySetInnerHTML={{
        __html: content
      }}
    />
  )
}

export default MailContent
