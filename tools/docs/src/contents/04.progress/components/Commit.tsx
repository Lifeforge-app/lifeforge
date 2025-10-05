import { Icon } from '@iconify/react/dist/iconify.js'

function Commit({ hash }: { hash: string }) {
  return (
    <a
      className="bg-bg-200 dark:bg-bg-800 hover:bg-bg-300/80 dark:hover:bg-bg-700/50 commit text-bg-600 dark:text-bg-400 mr-2 inline-flex translate-y-1 items-center gap-0.5 rounded-full py-1 pr-3 pl-2 text-sm font-semibold transition-all"
      href={`https://github.com/lifeforge-app/lifeforge/commit/${hash}`}
      referrerPolicy="no-referrer"
      rel="noreferrer"
      target="_blank"
    >
      <Icon className="size-5" icon="tabler:git-commit" />
      <code className="text-sm!">{hash.slice(0, 7)}</code>
    </a>
  )
}

export default Commit
