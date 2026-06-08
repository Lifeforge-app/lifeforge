import { useEffect, useState } from 'react'

import { Flex, Icon, TagChip, Transition } from '@lifeforge/ui'

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
    <Flex asChild align="center" gap="sm" p="sm">
      <a
        href="https://github.com/LifeForge-app/lifeforge"
        rel="noreferrer"
        target="_blank"
      >
        <Transition property="all">
          <Icon
            color={{
              base: 'bg-400',
              hover: 'bg-800',
              darkHover: 'bg-100'
            }}
            icon="uil:github"
            size="1.5rem"
          />
        </Transition>
        {stars ? (
          <TagChip icon="tabler:star-filled" label={stars.toLocaleString()} />
        ) : (
          <img
            alt="GitHub stars"
            src="https://img.shields.io/github/stars/LifeForge-app/lifeforge?style=for-the-badge&color=%2396b85a"
          />
        )}
      </a>
    </Flex>
  )
}

export default GithubStarCount
