import { TagChip } from '@lifeforge/ui'

function Commit({ hash }: { hash: string }) {
  return (
    <TagChip
      as="a"
      href={`https://github.com/lifeforge-app/lifeforge/commit/${hash}`}
      icon="tabler:git-commit"
      label={hash.slice(0, 7)}
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

export default Commit
