import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function Quotes(): React.ReactElement {
  const [quote, setQuote] = useState('')
  const [author, setAuthor] = useState('')

  useEffect(() => {
    if (!quote) {
      fetch('https://api.quotable.io/random?maxLength=100&tags=technology')
        .then(async res => await res.json())
        .then(data => {
          setQuote(data.content)
          setAuthor(data.author)
        })
        .catch(err => {
          toast.error('Failed to fetch quote')
          console.error(err)
        })
    }
  }, [])

  return (
    <div className="relative flex size-full flex-col items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 text-bg-800 shadow-custom">
      <Icon
        icon="tabler:quote"
        className="absolute right-2 top-2 text-8xl text-bg-800/10"
      />
      <Icon
        icon="tabler:quote"
        className="absolute bottom-2 left-2 rotate-180 text-8xl text-bg-800/10"
      />
      <div className="text-center text-xl font-medium">{quote}</div>
      <div className="h-[3px] w-4 rounded-full bg-bg-900" />
      <div className="text-center text-base font-semibold">{author}</div>
    </div>
  )
}
