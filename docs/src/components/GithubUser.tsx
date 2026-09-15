import { useEffect, useState } from 'react'

import { Box, Flex, Icon, Text, Transition } from '@lifeforge/ui'

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
    <Flex
      align="center"
      display="inline-flex"
      gap="sm"
      style={{
        transform: 'translateY(5.5px)'
      }}
    >
      <Flex
        centered
        bg={{
          base: 'bg-200',
          dark: 'bg-800'
        }}
        height="1.5em"
        overflow="hidden"
        position="relative"
        r="full"
        width="1.5em"
      >
        {avatarUrl ? (
          <Box asChild>
            <img alt={`${username}'s avatar`} src={avatarUrl} />
          </Box>
        ) : (
          <Icon color="muted" icon="tabler:user" size="1em" />
        )}
      </Flex>
      <Transition>
        <Text
          as="a"
          color={{
            base: 'bg-900',
            dark: 'bg-100',
            hover: 'custom-500'
          }}
          href={`https://github.com/${username}`}
          rel="noreferrer"
          target="_blank"
          weight="medium"
        >
          {username}
        </Text>
      </Transition>
    </Flex>
  )
}

export default GithubUser
