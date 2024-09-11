import { cookieParse } from 'pocketbase'

export default async function checkDownloadStatus(id: string): Promise<{
  status: 'completed' | 'failed' | 'in_progress'
  progress: number
}> {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_HOST
    }/youtube-video-storage/video/download-status`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token} `
      },
      body: JSON.stringify({ id: [id] })
    }
  )
  if (res.status === 200) {
    const data = await res.json()
    return Object.values(data.data)[0] as {
      status: 'completed' | 'failed' | 'in_progress'
      progress: number
    }
  }
  return {
    status: 'failed',
    progress: 0
  }
}
