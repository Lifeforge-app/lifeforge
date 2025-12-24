import { Icon } from '@iconify/react'
import { TagChip } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

function GithubStarCount() {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch('https://api.github.com/repos/LifeForge-app/lifeforge')
      .then(res => res.json())
      .then(data => setStars(data.stargazers_count))
      .catch(() => setStars(null))
  }, [])

  if (stars === null) return null

  return (
    <a
      className="group flex items-center gap-2 p-2 transition-colors"
      href="https://github.com/LifeForge-app/lifeforge"
      rel="noreferrer"
      target="_blank"
    >
      <Icon
        className="text-bg-400 group-hover:text-bg-800 dark:group-hover:text-bg-100 h-6 w-6 transition-colors"
        icon="uil:github"
      />
      <TagChip
        className="hidden sm:flex"
        icon="tabler:star-filled"
        label={stars.toLocaleString()}
      />
    </a>
  )
}

export default GithubStarCount
