import { TAILWIND_PALETTE, TagChip } from '@lifeforge/ui'

function Issue({ number }: { number: string }) {
  return (
    <TagChip
      as="a"
      color={TAILWIND_PALETTE['emerald'][500]}
      href={`https://github.com/lifeforge-app/lifeforge/issues/${number}`}
      icon="octicon:issue-opened-16"
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

export default Issue
