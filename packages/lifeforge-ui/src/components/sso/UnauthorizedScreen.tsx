import { Icon } from '@iconify/react/dist/iconify.js'

function UnauthorizedScreen({ frontendURL }: { frontendURL: string }) {
  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
      <Icon className="mb-4 text-9xl" icon="tabler:lock-access" />
      <h2 className="text-4xl">Unauthorized Personnel</h2>
      <p className="text-bg-500 mt-4 text-center text-lg">
        Please authenticate through single sign-on (SSO) in the system to access
        the locale editor.
      </p>
      <a
        className="bg-custom-500 text-bg-800 hover:bg-custom-400 mt-16 flex items-center justify-center gap-2 rounded-md p-4 px-6 font-semibold tracking-widest uppercase transition-all"
        href={frontendURL}
      >
        <Icon className="text-2xl" icon="tabler:hammer" />
        Go to System
      </a>
    </div>
  )
}

export default UnauthorizedScreen
