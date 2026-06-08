import { TAILWIND_PALETTE, TagChip } from '@lifeforge/ui'

function PR({ number }: { number: string }) {
  return (
    <TagChip
      as="a"
      color={TAILWIND_PALETTE['violet'][500]}
      href={`https://github.com/lifeforge-app/lifeforge/pull/${number}`}
      icon="tabler:git-pull-request"
      label={`#${number}`}
      mx="xs"
      referrerPolicy="no-referrer"
      rel="noreferrer"
      size="sm"
      style={{
        fontFamily: "'JetBrains Mono', monospace"
      }}
      target="_blank"
      variant="outlined"
    />
  )
}

export default PR
