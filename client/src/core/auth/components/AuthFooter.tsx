import { Icon } from '@iconify/react'

function AuthFooter() {
  return (
    <footer className="mt-8 flex flex-col items-center justify-center gap-2">
      <div className="text-bg-500 flex items-center gap-2">
        <Icon className="size-6" icon="tabler:creative-commons" />
        <Icon className="size-6" icon="tabler:creative-commons-by" />
        <Icon className="size-6" icon="tabler:creative-commons-nc" />
        <Icon className="size-6" icon="tabler:creative-commons-sa" />
      </div>
      <p className="text-bg-500 text-center text-sm">
        A project by{' '}
        <a
          className="text-custom-500 underline"
          href="https://melvinchia.dev"
          rel="noreferrer"
          target="_blank"
        >
          Melvin Chia
        </a>{' '}
        licensed under{' '}
        <a
          className="text-custom-500 underline"
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          rel="noreferrer"
          target="_blank"
        >
          CC BY-NC-SA 4.0
        </a>
        .
      </p>
    </footer>
  )
}

export default AuthFooter
