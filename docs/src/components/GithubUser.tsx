import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'

function GithubUser({ username }: { username: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem(`github_avatar_${username}`)
  )

  useEffect(() => {
    async function fetchAvatar() {
      try {
        const response = await fetch(`https://api.github.com/users/${username}`)

        const data = await response.json()

        if (data.avatar_url) {
          setAvatarUrl(data.avatar_url)
          localStorage.setItem(`github_avatar_${username}`, data.avatar_url)
        }
      } catch (error) {
        console.error('Error fetching GitHub user data:', error)
      }
    }

    if (!avatarUrl) {
      fetchAvatar()
    }
  }, [username])

  return (
    <div className="inline-flex translate-y-[5.5px] items-center gap-2">
      <div className="bg-bg-200 dark:bg-bg-800 relative h-6 w-6 rounded-full">
        {avatarUrl ? (
          <img
            alt={`${username}'s avatar`}
            className="h-6 w-6 rounded-full"
            src={avatarUrl}
          />
        ) : (
          <Icon
            className="text-bg-500 absolute inset-0 size-4"
            icon="tabler:user"
          />
        )}
      </div>
      <a
        className="text-bg-900 dark:text-bg-100 hover:text-custom-500! font-medium underline-offset-2 transition-all hover:underline"
        href={`https://github.com/${username}`}
        rel="noreferrer"
        target="_blank"
      >
        {username}
      </a>
    </div>
  )
}

export default GithubUser
