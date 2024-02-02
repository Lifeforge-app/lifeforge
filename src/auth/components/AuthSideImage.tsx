import React from 'react'

function AuthSideImage(): React.ReactElement {
  return (
    <section className="relative hidden h-full w-1/2 lg:flex">
      <img src="/login.jpg" alt="Login" className="h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-custom-500 to-custom-600 opacity-30" />
      <div className="absolute inset-0 bg-bg-900/50" />
      <p className="absolute left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col text-center text-5xl font-semibold tracking-wide text-bg-100">
        <span className="mb-2 text-2xl text-custom-400">
          One day, You&apos;ll leave this world behind
        </span>
        So live a life you remember
      </p>
    </section>
  )
}

export default AuthSideImage
