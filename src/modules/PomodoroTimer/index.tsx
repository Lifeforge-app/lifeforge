import React from 'react'
import ModuleHeader from '../../components/ModuleHeader'

export default function PomodoroTimer(): React.JSX.Element {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-12">
      <ModuleHeader
        title="Pomodoro Timer"
        desc="Increase your productivity by using the Pomodoro technique."
      />
      <div className="mt-8 flex min-h-0 w-full flex-1 flex-col"></div>
    </section>
  )
}
